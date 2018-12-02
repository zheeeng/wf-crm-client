import * as React from 'react'
import contactsStore from '~src/services/contacts'

import { ComponentProps } from '@roundation/roundation/lib/types'

export interface Props extends ComponentProps {
  children: React.ReactElement<any>
  group: string
}

const GroupsContactLayout: React.FC<Props> = React.memo(({ group, children }) => {
  const contactsContext = React.useContext(contactsStore.Context)

  React.useEffect(
    () => {
      contactsContext.fetchGroupContacts(group)
    },
    [contactsContext.fetchGroupContacts, group],
  )

  return children
})

export default contactsStore.inject(GroupsContactLayout)
