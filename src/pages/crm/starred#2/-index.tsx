import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import PeopleList from '~src/components/PeopleList'
import useQueriesLogic from '~src/containers/useQueriesLogic'

export interface Props extends ComponentProps<'', 'page' | 'search'> {}

const StarredMyCustomersIndex: React.FC<Props> = React.memo(({ navigate, queries, setQueries, location }) => {
  const {
    searchTerm,
    pagination,
    searchContacts,
    navigateToProfile,
    componentKey,
  } = useQueriesLogic(
    { navigate, queries, setQueries },
    location && location.state && location.state.fromAside,
  )

  return (
    <PeopleList
      key={componentKey}
      searchTerm={searchTerm}
      page={pagination.page}
      size={pagination.size}
      total={pagination.total}
      onSearch={searchContacts}
      navigateToProfile={navigateToProfile}
    />
  )
})

export default StarredMyCustomersIndex
