import * as React from 'react'
import groupsStore from '~src/services/groups'
import contactsStore from '~src/services/contacts'

import { ComponentProps } from '@roundation/roundation/lib/types'

export interface Props extends
  ComponentProps<'aside'> {
}

const MyCustomersLayout: React.FC<Props> = ({ slots, children }) => {
  const groupsContext = React.useContext(groupsStore.Context)
  const contactsContext = React.useContext(contactsStore.Context)

  React.useEffect(
    () => {
      groupsContext.fetchGroups()
      contactsContext.fetchContacts()
    },
    [],
  )

  return (
    <>
      {slots.aside}
      {children}
    </>
  )
}

export default groupsStore.inject(
  contactsStore.inject(
    MyCustomersLayout,
  ),
)
