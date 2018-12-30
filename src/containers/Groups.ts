import { useCallback, useMemo } from 'react'
import createContainer from 'constate'
import { useGet } from '~src/hooks/useRequest'
import { GroupAPI, groupInputAdapter } from '~src/types/Contact'

const ContactsCountContainer = createContainer(() => {
  const { data: groupsData, request: getGroupsData } = useGet<GroupAPI[]>()

  const fetchGroups = useCallback(
    () => { getGroupsData('/api/group')() },
    [],
  )

  const groups = useMemo(
    () => (groupsData || []).map(groupInputAdapter),
    [groupsData],
  )

  return {
    groups,
    fetchGroups,
  }
})

export default ContactsCountContainer
