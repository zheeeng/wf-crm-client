import { useCallback, useEffect } from 'react'
import constate from 'constate'
import { useGet } from '~src/hooks/useRequest'
import { Pagination } from '~src/types/Pagination'
import { useAccount } from '~src/containers/useAccount'

export const [UseContactsCountProvider, useContactsCount] = constate(() => {
  const { data: contactsData, request: getContactsData } =
    useGet<{ pagination: Pagination }>()
  const { data: starredData, request: getStarredData } =
    useGet<{ pagination: Pagination }>()

  const { authored } = useAccount()

  const refreshCounts = useCallback(() => {
    getContactsData('/api/people/search')({ size: 1, page: 1 })
    getStarredData('/api/people/search')({ size: 1, page: 1, favourite: true })
  }, [getContactsData, getStarredData])

  useEffect(() => {
    authored && refreshCounts()
  }, [authored, refreshCounts])

  return {
    contactsCount: contactsData ? contactsData.pagination.total : 0,
    starredCount: starredData ? starredData.pagination.total : 0,
    refreshCounts,
  }
})
