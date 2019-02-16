import React, { useCallback, useContext } from 'react'
import PeopleList from '~src/components/PeopleList'
import ContactsContainer from '~src/containers/Contacts'

import { ComponentProps } from '@roundation/roundation/lib/types'

export interface Props extends ComponentProps {}

const AllMyCustomersIndex: React.FC<Props> = React.memo(({ navigate }) => {
  const { pagination, fetchContacts } = useContext(ContactsContainer.Context)

  const searchContacts = useCallback(
    ({page = 0, size = 30, searchTerm = ''}) => fetchContacts({ page: page + 1, size, searchTerm }),
    [],
  )

  const navigateToProfile = useCallback((page: string) => navigate && navigate(page), [navigate])

  return (
    <PeopleList
      page={pagination.page - 1}
      size={pagination.size}
      total={pagination.total}
      onSearch={searchContacts}
      navigateToProfile={navigateToProfile}
    />
  )
})

export default AllMyCustomersIndex
