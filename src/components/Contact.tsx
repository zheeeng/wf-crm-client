import React, { useCallback, useMemo } from 'react'
import { usePrevious } from 'react-hanger'
import DetailsPaper from '~src/units/DetailsPaper'
import ContactPageHeader from '~src/components/ContactPageHeader'
import ContactProfile from '~src/components/ContactProfile'
import ContactAssets from '~src/components/ContactAssets'
import ContactActivities from '~src/components/ContactActivities'
import useWaiverSplitter from '~src/containers/useWaiverSplitter'
import useContact from '~src/containers/useContact'
import useContacts from '~src/containers/useContacts'
import useSwitch from '~src/hooks/useSwitch'

export interface Props {
  contactId: string
  navigate: (to: string, option?: { replace: boolean }) => void
  path: string
  page: string
  searchTerm: string
}

const ContactIndex: React.FC<Props> = React.memo(
  ({ navigate, path, contactId, page, searchTerm }) => {
    const { contacts, fromContactIdState } = useContacts()
    const { removeContact, removeContactError } = useContact(contactId)

    const lastContactId = usePrevious(contactId)
    const lastPage = usePrevious(page)
    const lastSearchTerm = usePrevious(searchTerm)

    const navigateToContact = useCallback(
      () => {
        const lastUrl = document.referrer
        const pathChunks = path.split('/')
        const backLevelPath = pathChunks[pathChunks.length - 1] === ''
          ? pathChunks.slice(0, -2).join('/')
          : pathChunks.slice(0, -1).join('/')

        if (lastUrl.includes(backLevelPath)) {
          window.history.go(-1)
        } else if (lastContactId) {
          const pageQuery = (lastPage && lastPage !== '1') ? `page=${lastPage}` : ''
          const searchQuery = lastSearchTerm ? `search=${lastSearchTerm}` : ''
          const query = [pageQuery, searchQuery].filter(it => it).join('&')
          const backPath = backLevelPath + (query ? `?${query}` : '')

          fromContactIdState.setValue(lastContactId)
          navigate(backPath)
        }
      },
      [path, lastContactId, lastPage, lastSearchTerm, fromContactIdState, navigate],
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
        path && navigate && previousContactId && navigate(`${path.split('/').slice(0, -1).join('/')}/${previousContactId}`, { replace: true })
      },
      [navigate, path, previousContactId],
    )

    const goNextContact = useCallback(
      () => {
        path && navigate && nextContactId
          && navigate(`${path.split('/').slice(0, -1).join('/')}/${nextContactId}`, { replace: true })
      },
      [navigate, path, nextContactId],
    )

    const handleDeleteContact = useSwitch(useCallback(
      async () => {
        await removeContact()
        !removeContactError && navigateToContact()
      },
      [removeContact, navigateToContact, removeContactError],
    ))

    const renderHeader = useCallback(
      () => (
        <ContactPageHeader
          onDelete={handleDeleteContact}
          onGoBack={navigateToContact}
          onGoPrevious={goPreviousContact}
          onGoNext={goNextContact}
          disableGoPrevious={!previousContactId}
          disableGoNext={!nextContactId}
        />
      ),
      [handleDeleteContact, navigateToContact, goPreviousContact, goNextContact, previousContactId, nextContactId],
    )

    const renderRightPart1 = useCallback(
      () => <ContactAssets contactId={contactId} />,
      [contactId],
    )
    const renderRightPart2 = useCallback(
      () => <ContactActivities contactId={contactId} />,
      [contactId],
    )

    return (
      <useWaiverSplitter.Provider>
        <DetailsPaper
          renderHeader={renderHeader}
          renderRightPart1={renderRightPart1}
          renderRightPart2={renderRightPart2}
        >
          <ContactProfile
            contactId={contactId}
          />
        </DetailsPaper>
      </useWaiverSplitter.Provider>
    )
  },
)

export default ContactIndex
