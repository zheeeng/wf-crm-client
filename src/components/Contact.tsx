import React, { useContext, useCallback, useEffect, useMemo } from 'react'
import useContact from '~src/containers/useContact'
import useContacts from '~src/containers/useContacts'
import DetailsPaper from '~src/units/DetailsPaper'
import ContactPageHeader from '~src/components/ContactPageHeader'
import ContactProfile from '~src/components/ContactProfile'
import ContactAssets from '~src/components/ContactAssets'
import ContactActivities from '~src/components/ContactActivities'
import NotificationContainer from '~src/containers/Notification'

export interface Props {
  contactId: string
  navigate: (to: string) => void
  path: string
}

const ContactIndex: React.FC<Props> = React.memo(
  ({ navigate, path, contactId }) => {
    const { notify } = useContext(NotificationContainer.Context)
    const { contacts } = useContacts()
    const { contact, removeContact, removeContactError } = useContact(contactId)

    useEffect(
      () => {
        removeContactError && notify(removeContactError.message)
      },
      [removeContactError],
    )

    const navigateToContact = useCallback(
      () => {
        path && navigate && navigate(path.split('/').slice(0, -1).join('/'))
      },
      [navigate, path],
    )

    const previousContactId = useMemo(
      () => {
        const target = contacts.findIndex(c => c.id === contactId)

        return Math.max(target - 1, 0)
      },
      [contactId, contacts],
    )

    const nextContactId = useMemo(
      () => {
        const len = contacts.length
        const target = contacts.findIndex(c => c.id === contactId)

        return Math.min(target + 1, len - 1)
      },
      [contactId, contacts],
    )

    const goPreviousContact = useCallback(
      () => {
        path && navigate && navigate(`${path.split('/').slice(0, -1).join('/')}/${previousContactId}`)
      },
      [navigate, path, previousContactId],
    )

    const goNextContact = useCallback(
      () => {
        path && navigate && navigate(`${path.split('/').slice(0, -1).join('/')}/${nextContactId}`)
      },
      [navigate, path, nextContactId],
    )

    const renderHeader = useCallback(
      () => (
        <ContactPageHeader
          onDelete={removeContact}
          onGoBack={navigateToContact}
          onGoPrevious={goPreviousContact}
          onGoNext={goNextContact}
          previousDisabled={previousContactId === 0}
          nextDisabled={nextContactId === contacts.length - 1}
        />
      ),
      [removeContact, navigateToContact],
    )

    const renderRightPart1 = useCallback(
      () => <ContactAssets />,
      [],
    )
    const renderRightPart2 = useCallback(
      () => contact && <ContactActivities activities={contact.info.activities} />,
      [contact],
    )

    if (!contact) return null

    return (
      <DetailsPaper
        renderHeader={renderHeader}
        renderRightPart1={renderRightPart1}
        renderRightPart2={renderRightPart2}
      >
        <ContactProfile
          contact={contact}
          contactId={contactId}
        />
      </DetailsPaper>
    )
  },
)

export default ContactIndex
