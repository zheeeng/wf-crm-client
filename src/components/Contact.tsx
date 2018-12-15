import React from 'react'
import useContact from '~src/containers/useContact'
import DetailsPaper from '~src/units/DetailsPaper'
import ContactPageHeader from '~src/components/ContactPageHeader'
import ContactProfile from '~src/components/ContactProfile'
import ContactAssets from '~src/components/ContactAssets'
import ContactActivities from '~src/components/ContactActivities'

export interface Props {
  contactId: string
}

const ContactIndex: React.FC<Props> = React.memo(({ contactId }) => {
  const { contact, tags, removeContact, addTag, removeTag } = useContact(contactId)

  if (!contact) return null

  return (
    <DetailsPaper
      header={<ContactPageHeader onDelete={removeContact} />}
      rightPart1={<ContactAssets />}
      rightPart2={<ContactActivities activities={contact.info.activities} />}
    >
      <ContactProfile
        contact={contact}
        tags={tags} addTag={addTag} removeTag={removeTag}
      />
    </DetailsPaper>
  )
})

export default ContactIndex
