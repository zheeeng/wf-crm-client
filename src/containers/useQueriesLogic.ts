import { useCallback, useEffect, useRef } from 'react'
import useContacts from '~src/containers/useContacts'
import { ComponentProps } from '@roundation/roundation'

export type Props = Pick<
ComponentProps<'', 'page' | 'search'>,
'navigate' | 'queries' | 'setQueries'
>

const useQueriesLogic = ({ navigate, queries, setQueries }: Props) => {
  const { pagination } = useContacts()

  const searchContacts = useCallback(
    ({page, searchTerm }: { page: number, searchTerm: string }) => {
      // const queryPage = queries.page ? queries.page[0] : ''
      const querySearch = queries.search ? queries.search[0] : ''
      if (searchTerm !== querySearch) {
        setQueries({ search: [searchTerm] })
      } else {
        setQueries({ page: [page.toString()], search: [searchTerm] })
      }
    },
    [setQueries, queries],
  )

  const pageRef = useRef(queries.page ? queries.page[0] : undefined)

  useEffect(
    () => { pageRef.current = queries.page ? queries.page[0] : undefined },
    [queries]
  )

  useEffect(
    () => {
      const pageStr = pagination.page.toString()
      if (pageStr !== pageRef.current && pageStr !== '1') {
        setQueries({ page: [pagination.page.toString()] })
      }
    },
    [pagination, setQueries]
  )

  const navigateToProfile = useCallback((page: string) => navigate && navigate(page), [navigate])

  return {
    pagination,
    searchContacts,
    navigateToProfile,
  }
}

export default useQueriesLogic
