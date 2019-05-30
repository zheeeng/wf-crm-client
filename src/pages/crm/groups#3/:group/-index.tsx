import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { ComponentProps } from '@roundation/roundation'
import PeopleList from '~src/components/PeopleList'
import ContactsContainer from '~src/containers/Contacts'

export interface Props extends ComponentProps<'', 'page' | 'search'> {
}

const GroupIndex: React.FC<Props> = React.memo(({ navigate, queries, setQueries, locationInfo }) => {
  const { pagination } = useContext(ContactsContainer.Context)

  const searchContacts = useCallback(
    ({page, searchTerm }: { page: number, searchTerm: string }) => {
      // const queryPage = queries.page ? queries.page[0] : ''
      const querySearch = queries.search ? queries.search[0] : ''
      if (searchTerm !== querySearch) {
        setQueries({ page: ['1'], search: [searchTerm] })
      } else {
        setQueries({ page: [(page + 1).toString()], search: [searchTerm] })
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
      if (pagination.page.toString() !== pageRef.current) {
        setQueries({ page: [pagination.page.toString()] })
      }
    },
    [pagination]
  )

  const navigateToProfile = useCallback((page: string) => navigate && navigate(page), [navigate])

  return (
    <PeopleList
      page={pagination.page - 1}
      size={pagination.size}
      total={pagination.total}
      onSearch={searchContacts}
      navigateToProfile={navigateToProfile}
      isGroupPage={true}
    />
  )
})

export default GroupIndex
