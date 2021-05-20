import React, { useMemo, useCallback, useEffect } from 'react'
import { useInput } from 'react-hanger'
import constate from 'constate'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import {
  groupInputAdapter,
  GroupFields,
  GroupAPI,
  groupFieldAdapter,
} from '~src/types/Contact'
import CheckCircle from '@material-ui/icons/CheckCircleOutline'
import { useAlert } from '~src/containers/useAlert'
import { useAccount } from '~src/containers/useAccount'

export const [UseGroupsProvider, useGroups] = constate(
  ({ groupId: gid }: { groupId?: string }) => {
    const groupIdState = useInput(gid ?? '')
    const { data: groupsData, request: getGroupsData } = useGet<GroupAPI[]>()
    const { request: postGroup, error: postGroupError } = usePost()
    const { request: putGroup, error: putGroupError } = usePut()
    const {
      data: deleteGroupData,
      request: deleteGroup,
      error: deleteGroupError,
    } = useDelete()
    const { authored } = useAccount()

    const refreshGroupCounts = useCallback(() => {
      authored && getGroupsData('/api/group')()
    }, [getGroupsData, authored])

    useEffect(() => {
      authored && refreshGroupCounts()
    }, [authored, refreshGroupCounts])

    const addGroup = useCallback(
      async (group: GroupFields) => {
        const { id } = await postGroup('/api/group')(groupFieldAdapter(group))

        refreshGroupCounts()

        return id as string
      },
      [postGroup, refreshGroupCounts],
    )

    const updateGroup = useCallback(
      async (group: GroupFields) => {
        if (groupIdState.value) {
          await putGroup(`/api/group/${groupIdState.value}`)(
            groupFieldAdapter(group),
          )
        }

        refreshGroupCounts()
      },
      [groupIdState.value, refreshGroupCounts, putGroup],
    )

    const removeGroup = useCallback(async () => {
      if (groupIdState.value) {
        await deleteGroup(`/api/group/${groupIdState.value}`)()
      }

      refreshGroupCounts()
    }, [deleteGroup, groupIdState.value, refreshGroupCounts])

    {
      const { success, fail } = useAlert()

      useEffect(() => {
        deleteGroupData &&
          success(
            <>
              <CheckCircle /> Group Removed!
            </>,
          )
      }, [deleteGroupData, success])

      useEffect(() => {
        deleteGroupError && fail(deleteGroupError.message)
      }, [deleteGroupError, fail])
    }

    const groups = useMemo(
      () => (groupsData ?? []).map(groupInputAdapter),
      [groupsData],
    )

    return {
      groupIdState,
      groups,
      refreshGroupCounts,
      addGroup,
      addGroupError: postGroupError,
      updateGroup,
      updateGroupError: putGroupError,
      removeGroup,
      removeGroupData: deleteGroupData,
      removeGroupError: deleteGroupError,
    }
  },
)
