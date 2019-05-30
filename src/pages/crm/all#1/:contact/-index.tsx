import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import Contact from '~src/components/Contact'

export interface Props extends ComponentProps {
  contact: string
}

const ContactIndex: React.FC<Props> = React.memo(
  ({ navigate, location, contact }) => (
    <Contact
      key={contact}
      contactId={contact}
      navigate={navigate!}
      path={location!.pathname}
    />
  ),
)

export default ContactIndex
