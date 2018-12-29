import React, { useCallback, useEffect } from 'react'
import useContacts from '~src/containers/useContacts'
import PeopleList from '~src/components/PeopleList'

import { ComponentProps } from '@roundation/roundation/lib/types'

export interface Props extends ComponentProps {}

const AllMyCustomersIndex: React.FC<Props> = React.memo(({ navigate }) => {
  const { pagination, contacts, fetchContacts, addContact, starContact, addMutation, starMutation } = useContacts()

  const refresh = useCallback(() => fetchContacts({ page: 1, size: 30 }), [])

  useEffect(() => { refresh() }, [addMutation, starMutation])

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
      onStar={starContact}
      onSearch={searchContacts}
      contacts={contacts}
      navigateToProfile={navigateToProfile}
      onSubmitContact={addContact}
    />
  )
})

export default AllMyCustomersIndex
