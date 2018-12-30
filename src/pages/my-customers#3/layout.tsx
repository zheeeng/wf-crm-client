import React from 'react'
import { ComponentProps } from '@roundation/roundation/lib/types'
import ContactsCountContainer from '~src/containers/ContactsCount'
export interface Props extends
  ComponentProps<'aside'> {
}

const MyCustomersLayout: React.FC<Props> = ({ slots, children }) => (
  <ContactsCountContainer.Provider>
    {slots.aside}
    {children}
  </ContactsCountContainer.Provider>
)

export default MyCustomersLayout
