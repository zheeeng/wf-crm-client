import React, { useContext, useEffect } from 'react'
import useContact from '~src/containers/useContact'
import DetailsPaper from '~src/units/DetailsPaper'
import ContactPageHeader from '~src/components/ContactPageHeader'
import ContactProfile from '~src/components/ContactProfile'
import ContactAssets from '~src/components/ContactAssets'
import ContactActivities from '~src/components/ContactActivities'
import NotificationContainer from '~src/containers/Notification'

export interface Props {
  contactId: string
}

const ContactIndex: React.FC<Props> = React.memo(({ contactId }) => {
  const { notify } = useContext(NotificationContainer.Context)
  const { contact, removeContact, removeContactError } = useContact(contactId)

  useEffect(
    () => {
      removeContactError && notify(removeContactError.message)
    },
    [removeContactError],
  )

  if (!contact) return null

  return (
    <DetailsPaper
      header={<ContactPageHeader onDelete={removeContact} />}
      rightPart1={<ContactAssets />}
      rightPart2={<ContactActivities activities={contact.info.activities} />}
    >
      <ContactProfile
        contact={contact}
        contactId={contactId}
      />
    </DetailsPaper>
  )
})

export default ContactIndex
