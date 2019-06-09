import { useCallback, useState, useEffect, useRef, useMemo } from 'react'
// import useMount from 'react-use/lib/useMount'
import useContacts from '~src/containers/useContacts'
import { ComponentProps } from '@roundation/roundation'

export type Props = Pick<
ComponentProps<'', 'page' | 'search'>,
'navigate' | 'queries' | 'setQueries'
>

const useQueriesLogic = ({ navigate, queries, setQueries }: Props, formAside: boolean = false) => {
  const [componentKey, resetComponentKey] = useState(Math.random().toString(16).slice(2))

  useEffect(
    () => { formAside && resetComponentKey(Math.random().toString(16).slice(2)) },
    [formAside]
  )

  const { pagination } = useContacts()

  const searchContacts = useCallback(
    ({page, searchTerm }: { page: number, searchTerm: string }) => {
      // const queryPage = queries.page ? queries.page[0] : ''
      const querySearch = queries.search ? queries.search[0] : ''
      const pageStr = page.toString()

      if (searchTerm !== querySearch || pageStr === '1') {
        setQueries({ search: [searchTerm] }, true)
      } else {
        setQueries({ page: [pageStr], search: [searchTerm] })
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

  const searchTerm = useMemo(
    () => queries.search ? queries.search[0] : '',
    [queries.search],
  )

  return {
    componentKey,
    searchTerm,
    pagination,
    searchContacts,
    navigateToProfile,
  }
}

export default useQueriesLogic
