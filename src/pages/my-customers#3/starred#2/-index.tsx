import * as React from 'react'
import contactsStore from '~src/services/contacts'
import PeopleList from '~src/components/PeopleList'

import { ComponentProps } from '@roundation/roundation/lib/types'

export interface Props extends ComponentProps {}

const StarredMyCustomersIndex: React.FC<Props> = React.memo(({ navigate }) => {
  const contactsContext = React.useContext(contactsStore.Context)

  React.useEffect(
    () => {
      contactsContext.fetchContacts({ starred: true })
    },
    [],
  )

  const starContact = React.useCallback(
    (id: string, star: boolean) => {
      contactsContext.starContact(id, star)
    },
    [],
  )

  const searchContacts = React.useCallback(
    ({page = 0, size = 30, searchTerm = ''}) => {
      contactsContext.fetchContacts({
        page: page + 1, size, searchTerm, starred: true,
      })
    },
    [],
  )

  const navigateToProfile = React.useCallback(
    (page: string) => {
      navigate && navigate(page)
    },
    [navigate],
  )

  return (
    <PeopleList
      page={contactsContext.page - 1}
      size={contactsContext.size}
      total={contactsContext.total}
      onStar={starContact}
      onSearch={searchContacts}
      contacts={contactsContext.contacts}
      navigateToProfile={navigateToProfile}
      onSubmitContact={contactsContext.addContact}
    />
  )
})

export default contactsStore.inject(StarredMyCustomersIndex)
