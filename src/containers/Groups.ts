import { useState, useCallback, useEffect } from 'react'
import createContainer from 'constate'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import { groupInputAdapter, GroupFields, GroupAPI, groupFieldAdapter } from '~src/types/Contact'
import useInfoCallback from '~src/hooks/useInfoCallback'

const GroupsContainer = createContainer(() => {
  const [groupId, setGroupId] = useState('')
  const { data: groupsData, request: getGroupsData } = useGet<GroupAPI[]>()
  const { request: postGroup, error: postGroupError } = usePost()
  const { request: putGroup, error: putGroupError } = usePut()
  const { request: deleteGroup, error: deleteGroupError } = useDelete()

  const refreshGroupCounts = useCallback(
    () => {
      getGroupsData('/api/group')()
    },
    [],
  )

  useEffect(refreshGroupCounts, [])

  const [addGroup, addGroupMutation] = useInfoCallback(
    async (group: GroupFields) => {
      await postGroup('/api/group')(groupFieldAdapter(group))
      await refreshGroupCounts()
    },
    [],
  )

  const [updateGroup, updateGroupMutation] = useInfoCallback(
    async (group: GroupFields) => {
      if (groupId) {
        await putGroup(`/api/group/${groupId}`)(groupFieldAdapter(group))
        await refreshGroupCounts()
      }
    },
    [groupId],
  )

  const [removeGroup, removeGroupMutation] = useInfoCallback(
    async () => {
      if (groupId) {
        await deleteGroup(`/api/group/${groupId}`)()
        await refreshGroupCounts()
      }
    },
    [groupId],
  )

  return {
    groupId,
    setGroupId,
    groups: (groupsData || []).map(groupInputAdapter),
    refreshGroupCounts,
    addGroup, addGroupMutation, addGroupError: postGroupError,
    updateGroup, updateGroupMutation, updateGroupError: putGroupError,
    removeGroup, removeGroupMutation, removeGroupError: deleteGroupError,
  }
})

export default GroupsContainer
