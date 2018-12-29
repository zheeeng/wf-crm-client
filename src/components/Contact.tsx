import React, { useContext, useCallback, useEffect, useMemo } from 'react'
import useContact from '~src/containers/useContact'
import ContactsContainer from '~src/containers/Contacts'
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
    const { contacts } = useContext(ContactsContainer.Context)
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
        const calculatedIndex = Math.max(target - 1, 0)

        return calculatedIndex === 0 ? null : contacts[calculatedIndex].id
      },
      [contactId, contacts],
    )

    const nextContactId = useMemo(
      () => {
        const len = contacts.length
        const target = contacts.findIndex(c => c.id === contactId)
        const calculatedIndex = Math.min(target + 1, len - 1)

        return calculatedIndex === len - 1 ? null : contacts[calculatedIndex].id
      },
      [contactId, contacts],
    )

    const goPreviousContact = useCallback(
      () => {
        path && navigate && previousContactId
          && navigate(`${path.split('/').slice(0, -1).join('/')}/${previousContactId}`)
      },
      [navigate, path, previousContactId],
    )

    const goNextContact = useCallback(
      () => {
        path && navigate && nextContactId
          && navigate(`${path.split('/').slice(0, -1).join('/')}/${nextContactId}`)
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
          previousDisabled={previousContactId === null}
          nextDisabled={nextContactId === null}
        />
      ),
      [removeContact, navigateToContact],
    )

    const renderRightPart1 = useCallback(
      () => contact && <ContactAssets />,
      [],
    )
    const renderRightPart2 = useCallback(
      () => contact && <ContactActivities activities={contact.info.activities} />,
      [contact],
    )

    return (
      <DetailsPaper
        renderHeader={renderHeader}
        renderRightPart1={renderRightPart1}
        renderRightPart2={renderRightPart2}
      >
        {contact && (
          <ContactProfile
            contact={contact}
            contactId={contactId}
          />
        )}
      </DetailsPaper>
    )
  },
)

export default ContactIndex
