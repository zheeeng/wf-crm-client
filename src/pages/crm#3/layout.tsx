import React from 'react'
import { ComponentProps } from '@roundation/roundation/lib/types'
import ContactsCountContainer from '~src/containers/ContactsCount'
import GroupsContainer from '~src/containers/Groups'
export interface Props extends
  ComponentProps<'aside'> {
}

const MyCustomersLayout: React.FC<Props> = ({ slots, children }) => (
  <ContactsCountContainer.Provider>
    <GroupsContainer.Provider>
      {slots.aside}
      {children}
    </GroupsContainer.Provider>
  </ContactsCountContainer.Provider>
)

export default MyCustomersLayout
