import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import PeopleList from '~src/components/PeopleList'
import useQueriesLogic from '~src/containers/useQueriesLogic'

export interface Props extends ComponentProps<'', 'page' | 'search'> {
}

const GroupIndex: React.FC<Props> = React.memo(({ navigate, queries, setQueries }) => {
  const {
    pagination,
    searchContacts,
    navigateToProfile,
  } = useQueriesLogic({ navigate, queries, setQueries })

  return (
    <PeopleList
      page={pagination.page}
      size={pagination.size}
      total={pagination.total}
      onSearch={searchContacts}
      navigateToProfile={navigateToProfile}
      isGroupPage={true}
    />
  )
})

export default GroupIndex
