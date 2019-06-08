import React, { useMemo, useCallback, useEffect } from 'react'
import { useInput } from 'react-hanger';
import createUseContext from 'constate'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import { groupInputAdapter, GroupFields, GroupAPI, groupFieldAdapter } from '~src/types/Contact'
import CheckCircle from '@material-ui/icons/CheckCircleOutline'
import useAlert from '~src/containers/useAlert'
import useAccount from '~src/containers/useAccount'

const useGroups = createUseContext(() => {
  const groupIdState = useInput('')
  const { data: groupsData, request: getGroupsData } = useGet<GroupAPI[]>()
  const { request: postGroup, error: postGroupError } = usePost()
  const { request: putGroup, error: putGroupError } = usePut()
  const { data: deleteGroupData, request: deleteGroup, error: deleteGroupError } = useDelete()
  const { authored } = useAccount()

  const addGroup = useCallback(
    async (group: GroupFields) => {
      const { id } = await postGroup('/api/group')(groupFieldAdapter(group))
      return id as string
    },
    [postGroup],
  )

  const updateGroup = useCallback(
    async (group: GroupFields) => {
      if (groupIdState.value) {
        await putGroup(`/api/group/${groupIdState.value}`)(groupFieldAdapter(group))
      }
    },
    [putGroup, groupIdState.value],
  )

  const removeGroup = useCallback(
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
    const { success, fail } = useAlert()

    useEffect(
      () => { authored && refreshGroupCounts() },
      [authored, addGroup, updateGroup, removeGroup, refreshGroupCounts],
    )

    useEffect(
      () => { deleteGroupData && success(<><CheckCircle /> Contacts Removed From Group</>) },
      [deleteGroupData, success],
    )

    useEffect(
      () => { deleteGroupError && fail(deleteGroupError.message) },
      [deleteGroupError, fail],
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
    addGroup, addGroupError: postGroupError,
    updateGroup, updateGroupError: putGroupError,
    removeGroup,
    removeGroupData: deleteGroupData,
    removeGroupError: deleteGroupError,
  }
})

export default useGroups
