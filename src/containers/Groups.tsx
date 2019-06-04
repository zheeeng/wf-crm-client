import React from 'react'
import { useState, useCallback, useEffect, useContext } from 'react'
import createContainer from 'constate'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import { groupInputAdapter, GroupFields, GroupAPI, groupFieldAdapter } from '~src/types/Contact'
import useInfoCallback from '~src/hooks/useInfoCallback'
import AlertContainer from './Alert'
import CheckCircle from '@material-ui/icons/CheckCircleOutline'
import AccountContainer from './Account'

const GroupsContainer = createContainer(() => {
  const [ groupId, setGroupId ] = useState('')
  const { data: groupsData, request: getGroupsData } = useGet<GroupAPI[]>()
  const { request: postGroup, error: postGroupError } = usePost()
  const { request: putGroup, error: putGroupError } = usePut()
  const { data: deleteGroupData, request: deleteGroup, error: deleteGroupError } = useDelete()
  const { authored } = useContext(AccountContainer.Context)

  const [addGroup, addGroupMutation] = useInfoCallback(
    async (group: GroupFields) => {
      const { id } = await postGroup('/api/group')(groupFieldAdapter(group))
      return id as string
    },
    [postGroup],
  )

  const [updateGroup, updateGroupMutation] = useInfoCallback(
    async (group: GroupFields) => {
      if (groupId) {
        await putGroup(`/api/group/${groupId}`)(groupFieldAdapter(group))
      }
    },
    [putGroup, groupId],
  )

  const [removeGroup, removeGroupMutation] = useInfoCallback(
    async () => {
      if (groupId) {
        await deleteGroup(`/api/group/${groupId}`)()
      }
    },
    [deleteGroup, groupId],
  )

  const refreshGroupCounts = useCallback(
    () => {
      getGroupsData('/api/group')()
    },
    [getGroupsData],
  )

  {
    const { success, fail } = useContext(AlertContainer.Context)

    useEffect(
      () => { authored && refreshGroupCounts() },
      [authored, addGroupMutation, updateGroupMutation, removeGroupMutation],
    )

    useEffect(
      () => { deleteGroupData && success(<><CheckCircle /> Contacts Removed From Group</>) },
      [deleteGroupData],
    )

    useEffect(
      () => { deleteGroupError && fail(deleteGroupError.message) },
      [deleteGroupError]
    )
  }

  return {
    groupId,
    setGroupId,
    groups: (groupsData || []).map(groupInputAdapter),
    refreshGroupCounts,
    addGroup, addGroupMutation, addGroupError: postGroupError,
    updateGroup, updateGroupMutation, updateGroupError: putGroupError,
    removeGroup, removeGroupMutation,
    removeGroupData: deleteGroupData,
    removeGroupError: deleteGroupError,
  }
})

export default GroupsContainer
