import { useCallback, useEffect } from 'react'
import createContainer from 'constate'
import { useGet } from '~src/hooks/useRequest'
import { Pagination } from '~src/types/Pagination'
import { groupInputAdapter, GroupAPI } from '~src/types/Contact'

const ContactsCountContainer = createContainer(() => {
  const { data: contactsData, request: getContactsData } = useGet<{ pagination: Pagination}>()
  const { data: starredData, request: getStarredData } = useGet<{ pagination: Pagination}>()
  const { data: groupsData, request: getGroupsData } = useGet<GroupAPI[]>()

  const refreshCounts = useCallback(
    () => {
      getContactsData('/api/people/search')({ size: 1, page: 1 })
      getStarredData('/api/people/search')({ size: 1, page: 1, favourite: true })
      getGroupsData('/api/group')()
    },
    [],
  )

  useEffect(refreshCounts, [])

  return {
    contactsCount: contactsData ? contactsData.pagination.total : 0,
    starredCount: starredData ? starredData.pagination.total : 0,
    groups: (groupsData || []).map(groupInputAdapter),
    refreshCounts,
  }
})

export default ContactsCountContainer
