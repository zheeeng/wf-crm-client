import React, { useContext, useCallback, useEffect, useMemo } from 'react'
import useContact from '~src/containers/useContact'
import ContactsContainer from '~src/containers/Contacts'
import DetailsPaper from '~src/units/DetailsPaper'
import ContactPageHeader from '~src/components/ContactPageHeader'
import ContactProfile from '~src/components/ContactProfile'
import ContactAssets from '~src/components/ContactAssets'
import ContactActivities from '~src/components/ContactActivities'
import AlertContainer from '~src/containers/Alert'
import WaiverSplitterContainer from '~src/containers/WaiverSplitter'

export interface Props {
  contactId: string
  navigate: (to: string) => void
  path: string
}

const ContactIndex: React.FC<Props> = React.memo(
  ({ navigate, path, contactId }) => {
    const { fail } = useContext(AlertContainer.Context)
    const { contacts } = useContext(ContactsContainer.Context)
    const { contact, fetchContact, removeContact, removeContactError } = useContact(contactId)

    useEffect(
      () => { fetchContact() },
      [contactId],
    )

    useEffect(
      () => { removeContactError && fail(removeContactError.message) },
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
        const targetIndex = contacts.findIndex(c => c.id === contactId)
        const calculatedIndex = Math.max(targetIndex - 1, -1)

        return calculatedIndex === -1 ? null : contacts[calculatedIndex].id
      },
      [contactId, contacts],
    )

    const nextContactId = useMemo(
      () => {
        const len = contacts.length
        const targetIndex = contacts.findIndex(c => c.id === contactId)
        const calculatedIndex = Math.min(targetIndex + 1, len - 1)

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
          disableGoPrevious={!previousContactId}
          disableGoNext={!nextContactId}
        />
      ),
      [removeContact, navigateToContact],
    )

    const renderRightPart1 = useCallback(
      () => <ContactAssets contactId={contactId} />,
      [contact],
    )
    const renderRightPart2 = useCallback(
      () => <ContactActivities contactId={contactId} />,
      [contact],
    )

    return (
      <WaiverSplitterContainer.Provider>
        <DetailsPaper
          renderHeader={renderHeader}
          renderRightPart1={renderRightPart1}
          renderRightPart2={renderRightPart2}
        >
          <ContactProfile
            contactId={contactId}
          />
        </DetailsPaper>
      </WaiverSplitterContainer.Provider>
    )
  },
)

export default ContactIndex
