import React from 'react'
import Contact from '~src/components/Contact'
import { ComponentProps } from '@roundation/roundation/lib/types'

export interface Props extends ComponentProps {
  contact: string
}

const ContactIndex: React.FC<Props> = React.memo(
  ({ navigate, location, contact }) => (
    <Contact
      contactId={contact}
      navigate={navigate!}
      path={location!.pathname}
    />
  ),
)

export default ContactIndex
