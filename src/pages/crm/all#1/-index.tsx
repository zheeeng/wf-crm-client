import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import PeopleList from '~src/components/PeopleList'
import useQueriesLogic from '~src/containers/useQueriesLogic'

export interface Props extends ComponentProps<'', 'page' | 'search'> {}

const AllMyCustomersIndex: React.FC<Props> = React.memo(({ navigate, queries, setQueries }) => {
  const {
    searchTerm,
    pagination,
    searchContacts,
    navigateToProfile,
  } = useQueriesLogic({ navigate, queries, setQueries })

  return (
    <PeopleList
      searchTerm={searchTerm}
      page={pagination.page}
      size={pagination.size}
      total={pagination.total}
      onSearch={searchContacts}
      navigateToProfile={navigateToProfile}
    />
  )
})

export default AllMyCustomersIndex
