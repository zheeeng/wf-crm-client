import { useCallback, useEffect, useMemo } from 'react'
import { useGet } from '~src/hooks/useRequest'
import { GroupAPI, groupInputAdapter } from '~src/types/Contact'

const useGroups = () => {
  const { data: groupsData, request: getGroupsData } = useGet<GroupAPI[]>()

  const fetchGroups = useCallback(
    () => { getGroupsData('/api/group')() },
    [],
  )

  const groups = useMemo(
    () => (groupsData || []).map(groupInputAdapter),
    [groupsData],
  )

  useEffect(
    () => { fetchGroups() },
    [],
  )

  return {
    groups,
    fetchGroups,
  }
}

export default useGroups
