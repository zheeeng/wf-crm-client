import React from 'react'
import Contact from '~src/components/Contact'

export interface Props {
  contact: string
}

const ContactIndex: React.FC<Props> = React.memo(({ contact }) => <Contact contactId={contact} />)

export default ContactIndex
