import React, { useCallback, useMemo } from 'react'
import { usePrevious } from 'react-hanger'
import Typography from '@material-ui/core/Typography'
import DetailsPaper, { EmptyDetailsPaper } from '~src/units/DetailsPaper'
import ContactPageHeader from '~src/components/ContactPageHeader'
import ContactProfile from '~src/components/ContactProfile'
import ContactAssets from '~src/components/ContactAssets'
import ContactActivities from '~src/components/ContactActivities'
import useWaiverSplitter from '~src/containers/useWaiverSplitter'
import useContact from '~src/containers/useContact'
import useContacts from '~src/containers/useContacts'
import useSwitch from '~src/hooks/useSwitch'
import useAlert from '~src/containers/useAlert'

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
    const { contact, removeContact } = useContact(contactId)

    const lastContactId = usePrevious(contactId)
    const lastPage = usePrevious(page)
    const lastSearchTerm = usePrevious(searchTerm)

    const navigateToContactList = useCallback(
      () => {
        const pathChunks = path.split('/')
        const backLevelPath = pathChunks[pathChunks.length - 1] === ''
          ? pathChunks.slice(0, -2).join('/')
          : pathChunks.slice(0, -1).join('/')

        const pageQuery = (lastPage && lastPage !== '1') ? `page=${lastPage}` : ''
        const searchQuery = lastSearchTerm ? `search=${lastSearchTerm}` : ''
        const query = [pageQuery, searchQuery].filter(it => it).join('&')
        const backPath = backLevelPath + (query ? `?${query}` : '')

        if (lastContactId) fromContactIdState.setValue(lastContactId)
        navigate(backPath)
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

    const { success } = useAlert()

    const handleDeleteContact = useSwitch(useCallback(
      () => {
        success('Start deleting contact, it may take a while.')
        removeContact()
        navigateToContactList()
      },
      [removeContact, navigateToContactList, success],
    ))

    const renderHeader = useCallback(
      () => (
        <ContactPageHeader
          onDelete={handleDeleteContact}
          onGoBack={navigateToContactList}
          onGoPrevious={goPreviousContact}
          onGoNext={goNextContact}
          disableGoPrevious={!previousContactId}
          disableGoNext={!nextContactId}
        />
      ),
      [handleDeleteContact, navigateToContactList, goPreviousContact, goNextContact, previousContactId, nextContactId],
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
        {(contact && contact.isDeleting)
          ?(
            <EmptyDetailsPaper renderHeader={renderHeader}>
              <Typography align="center">
                This Contact is in deleting process, please check the result later.
              </Typography>
            </EmptyDetailsPaper>
          )
          : (
            <DetailsPaper
              renderHeader={renderHeader}
              renderRightPart1={renderRightPart1}
              renderRightPart2={renderRightPart2}
            >
              <ContactProfile
                contactId={contactId}
              />
            </DetailsPaper>
          )
        }
      </useWaiverSplitter.Provider>
    )
  },
)

export default ContactIndex
