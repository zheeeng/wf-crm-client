import * as React from 'react'
import contactStore from '~src/services/contact'
import DetailsPaper from '~src/units/DetailsPaper'
import ContactPageHeader from '~src/components/ContactPageHeader'
import ContactProfile from '~src/components/ContactProfile'
import ContactAssets from '~src/components/ContactAssets'
import ContactActivities from '~src/components/ContactActivities'

export interface Props {
  contact: string
}

const ContactIndex: React.FC<Props> = React.memo(({ contact }) => {
  const contactContext = React.useContext(contactStore.Context)

  React.useEffect(
    () => {
      if (!contact) return
      contactContext.fetchContact(contact)
    },
    [],
  )

  const deleteContact = React.useCallback(
    () => {
      if (!contact) return
      contactContext.deleteContact(contact)
    },
    [contactContext.deleteContact, contact],
  )

  if (!contactContext.contact) return null

  return (
    <DetailsPaper
      header={<ContactPageHeader onDelete={deleteContact} />}
      rightPart1={<ContactAssets />}
      rightPart2={<ContactActivities id={contact} />}
    >
      <ContactProfile />
    </DetailsPaper>
  )
})

export default contactStore.inject(ContactIndex)
