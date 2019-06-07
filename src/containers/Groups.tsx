import React, { useMemo, useCallback, useEffect, useContext } from 'react'
import { useInput } from 'react-hanger';
import createContainer from 'constate'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import { groupInputAdapter, GroupFields, GroupAPI, groupFieldAdapter } from '~src/types/Contact'
import useInfoCallback from '~src/hooks/useInfoCallback'
import AlertContainer from './Alert'
import CheckCircle from '@material-ui/icons/CheckCircleOutline'
import AccountContainer from './Account'

const GroupsContainer = createContainer(() => {
  const groupIdState = useInput('')
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
      if (groupIdState.value) {
        await putGroup(`/api/group/${groupIdState.value}`)(groupFieldAdapter(group))
      }
    },
    [putGroup, groupIdState.value],
  )

  const [removeGroup, removeGroupMutation] = useInfoCallback(
    async () => {
      if (groupIdState.value) {
        await deleteGroup(`/api/group/${groupIdState.value}`)()
      }
    },
    [deleteGroup, groupIdState.value],
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
      [deleteGroupError],
    )
  }

  const groups = useMemo(
    () => (groupsData || []).map(groupInputAdapter),
    [groupsData],
  )

  return {
    groupIdState,
    groups,
    refreshGroupCounts,
    addGroup, addGroupMutation, addGroupError: postGroupError,
    updateGroup, updateGroupMutation, updateGroupError: putGroupError,
    removeGroup, removeGroupMutation,
    removeGroupData: deleteGroupData,
    removeGroupError: deleteGroupError,
  }
})

export default GroupsContainer
