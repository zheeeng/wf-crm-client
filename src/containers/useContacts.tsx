import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useInput } from 'react-hanger'
import constate from 'constate'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Pagination } from '~src/types/Pagination'
import {
  PeopleAPI,
  ContactFields,
  contactInputAdapter,
  Contact,
  contactFieldAdapter,
} from '~src/types/Contact'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'

import CheckCircle from '@material-ui/icons/CheckCircleOutline'

import { useContactsCount } from '~src/containers/useContactsCount'
import { useAlert } from '~src/containers/useAlert'
import sleep from '~src/utils/sleep'
import downloadFile from '~src/utils/downloadFile'
import useLatest from '~src/hooks/useLatest'
import {
  localStorageKeyForDeletingContacts,
  localStorageExpirationForDeletingContacts,
  delContactRecordKey,
  delContactRecordPattern,
} from '~src/meta/localCacheConfig'
import useLocalCache from '~src/hooks/useLocalCache'
import { useNotification } from '~src/containers/useNotification'

type FetchParams = {
  page?: number
  size?: number
  searchTerm?: string
  favourite?: boolean
  groupId?: string
}
type ContactsResponse = { pagination: Pagination; result: PeopleAPI[] }

type ContainerProps = {
  exportAll?: boolean
  page?: number
  size?: number
  searchTerm?: string
  favourite?: boolean
  groupId?: string
}

export const [UseContactsProvider, useContacts] = constate(
  ({
    exportAll,
    page = 1,
    // size = 30,
    searchTerm = '',
    groupId = '',
    favourite = false,
  }: ContainerProps) => {
    const { refreshCounts } = useContactsCount()
    const { notify } = useNotification()

    const {
      data: contactsData,
      isLoading: getContactsIsLoading,
      request: getContacts,
      error: getContactsError,
    } = useGet<ContactsResponse>()

    const {
      data: contactsData2,
      request: getContacts2,
      error: getContactsError2,
    } = useGet<ContactsResponse>()

    const { request: deleteContact, error: deleteContactError } = useDelete()

    const {
      data: postContactData,
      request: postContact,
      error: postContactError,
    } = usePost()
    const { request: putContact, error: putContactError } = usePut()
    const {
      data: postContactToGroupData,
      request: postContactToGroup,
      error: postContactToGroupError,
    } = usePost()

    const {
      data: postMergeContactsData,
      request: postMergeContacts,
      error: postMergeContactsError,
    } = usePost<PeopleAPI>()

    const {
      data: deleteContactsFromGroupData,
      request: deleteContactsFromGroup,
      error: deleteContactsFromGroupError,
    } = useDelete<PeopleAPI>()

    const { request: postExportContacts } = usePost<{ task_id: string }>()
    const {
      request: getExportStatus,
      data: exportContactsStatus,
      error: getExportStatusError,
    } = useGet<{
      id: string
      ready: boolean
      status: string
      result?: {
        url: string
      }
    }>()

    const latestContactsData = useLatest(contactsData, contactsData2)

    const contactsPagination = useMemo<Pagination>(
      () =>
        latestContactsData
          ? latestContactsData.pagination
          : { page, size: 0, total: 0 },
      [latestContactsData, page],
    )

    const queryPagination = useMemo(
      () => ({ ...contactsPagination, page }),
      [contactsPagination, page],
    )

    const latestPagination = useLatest(contactsPagination, queryPagination)

    const pagination = useMemo(
      () => latestPagination ?? { page, size: 0, total: 0 },
      [latestPagination, page],
    )

    const { write, remove, rereadByPattern } = useLocalCache(
      localStorageKeyForDeletingContacts,
      localStorageExpirationForDeletingContacts,
    )

    const contacts = useMemo<Contact[]>(() => {
      const contactIdsMap = rereadByPattern(delContactRecordPattern())

      return (latestContactsData ? latestContactsData.result : [])
        .map(contactInputAdapter)
        .map((contact) =>
          contactIdsMap[delContactRecordKey(contact.id)]
            ? { ...contact, isDeleting: true }
            : contact,
        )
    }, [latestContactsData, rereadByPattern])

    const fetchContacts = useCallback(
      async (size: number, pageNumber?: number) => {
        const params: FetchParams = {
          page: pageNumber ?? page,
          size,
          favourite,
          groupId,
          searchTerm,
        }

        return await getContacts('/api/people/search')(params)
      },
      [getContacts, page, favourite, groupId, searchTerm],
    )

    const fetchContactsQuietly = useCallback(
      async (size: number) => {
        const params: FetchParams = {
          page,
          size,
          favourite,
          groupId,
          searchTerm,
        }

        return await getContacts2('/api/people/search')(params)
      },
      [getContacts2, page, favourite, groupId, searchTerm],
    )

    const addContact = useCallback(
      async (contact: ContactFields) => {
        const contactData = favourite ? { ...contact, favourite } : contact
        await postContact('/api/people')(contactFieldAdapter(contactData))

        refreshCounts()
        page === 1 ? fetchContactsQuietly(30) : fetchContacts(30, 1)
      },
      [
        favourite,
        fetchContacts,
        fetchContactsQuietly,
        page,
        postContact,
        refreshCounts,
      ],
    )

    const starContact = useCallback(
      async (id: string, star: boolean) => {
        await putContact(`/api/people/${id}`)({ favourite: star })
        refreshCounts()
        fetchContactsQuietly(30)
      },
      [fetchContactsQuietly, putContact, refreshCounts],
    )

    const removeContact = useCallback(
      async (contactIds: string[]) => {
        await contactIds.reduce(async (_, id) => {
          await sleep(35)
          write(delContactRecordKey(id), id)
          deleteContact(`/api/people/${id}`)().then(() => {
            remove(delContactRecordKey(id))
            refreshCounts()
          })
        }, Promise.resolve())

        page === 1 ? fetchContactsQuietly(30) : fetchContacts(30, 1)
      },
      [
        deleteContact,
        fetchContacts,
        fetchContactsQuietly,
        page,
        refreshCounts,
        write,
        remove,
      ],
    )

    const addContactToGroup = useCallback(
      async (groupId: string, contactIds: string[]) => {
        await postContactToGroup(`/api/group/${groupId}/people`)({
          people: contactIds,
        })
      },
      [postContactToGroup],
    )

    const removeContactsFromGroup = useCallback(
      async (groupId: string, contactIds: string[]) => {
        await deleteContactsFromGroup(`/api/group/${groupId}/people`)({
          people: contactIds,
        })

        page === 1 ? fetchContactsQuietly(30) : fetchContacts(30, 1)
      },
      [deleteContactsFromGroup, fetchContacts, fetchContactsQuietly, page],
    )

    const mergeContacts = useCallback(
      async ([targetId, ...sourceIds]: string[]) => {
        await sourceIds.reduce(async (chain, sourceId) => {
          try {
            await chain
            return await postMergeContacts(
              `/api/people/${targetId}/mergePerson/${sourceId}`,
            )()
          } catch {
            return Promise.resolve()
          }
        }, Promise.resolve() as Promise<any>)

        refreshCounts()
        page === 1 ? fetchContactsQuietly(30) : fetchContacts(30, 1)
      },
      [
        fetchContacts,
        fetchContactsQuietly,
        page,
        postMergeContacts,
        refreshCounts,
      ],
    )

    const exportContacts = useCallback(
      async (contactIds?: string[]) => {
        const query = contactIds ? { id: contactIds } : {}
        const response = await postExportContacts(
          '/api/backgroundTasks/exportPeople',
        )({ query })

        if (response) {
          const taskId = response.task_id

          let statusResponse = await getExportStatus(
            `/api/backgroundTasks/checkStatus/${taskId}`,
          )()

          while (statusResponse && statusResponse.status === 'PENDING') {
            await sleep(2000)
            statusResponse = await getExportStatus(
              `/api/backgroundTasks/checkStatus/${taskId}`,
            )()
          }

          if (
            statusResponse &&
            statusResponse.ready === true &&
            statusResponse.result &&
            statusResponse.result.url
          ) {
            downloadFile(statusResponse.result.url)
          }
        }
      },
      [postExportContacts, getExportStatus],
    )

    useEffect(() => {
      exportAll &&
        notify(
          <>
            <Typography variant="body1">
              Do you want to export all contacts?
            </Typography>
            <Button
              color="primary"
              style={{ marginLeft: 24 }}
              variant="text"
              onClick={() => exportContacts()}
            >
              Yes
            </Button>
          </>,
        )
    }, [exportAll, exportContacts, notify])

    useEffect(() => {
      refreshCounts()
    }, [refreshCounts])

    // alter effects
    {
      const { success, fail } = useAlert()

      useEffect(() => {
        if (exportContactsStatus && exportContactsStatus.ready === true) {
          success(
            <>
              <CheckCircle /> Start exporting contacts
            </>,
          )
        }
      }, [exportContactsStatus, success])

      useEffect(() => {
        getExportStatusError && fail(getExportStatusError.message)
      }, [fail, getExportStatusError])

      useEffect(() => {
        postContactError && fail(postContactError.message)
      }, [fail, postContactError])

      useEffect(() => {
        putContactError && fail(putContactError.message)
      }, [fail, putContactError])
      // useEffect(
      //   () => { removeContactData && success(<><CheckCircle /> Contacts Removed</>) },
      //   [removeContactData],
      // )
      // useEffect(
      //   () => { removeContactError && fail(removeContactError.message) },
      //   [removeContactError],
      // )
      useEffect(() => {
        postContactToGroupData &&
          success(
            <>
              <CheckCircle /> Contacts Added
            </>,
          )
      }, [postContactToGroupData, success])
      useEffect(() => {
        postContactToGroupError && fail(postContactToGroupError.message)
      }, [fail, postContactToGroupError])
      useEffect(() => {
        postMergeContactsData &&
          success(
            <>
              <CheckCircle /> Contacts Merged
            </>,
          )
      }, [postMergeContactsData, success])
      useEffect(() => {
        postMergeContactsError && fail(postMergeContactsError.message)
      }, [fail, postMergeContactsError])
      useEffect(() => {
        deleteContactsFromGroupData &&
          success(
            <>
              <CheckCircle /> Contacts Removed From Group
            </>,
          )
      }, [deleteContactsFromGroupData, success])
      useEffect(() => {
        deleteContactsFromGroupError &&
          fail(deleteContactsFromGroupError.message)
      }, [deleteContactsFromGroupError, fail])
    }

    const [showAddContactMessage, setShowAddContactMessage] = useState(false)

    useEffect(() => {
      let ignore = false
      if (postContactData) {
        setShowAddContactMessage(true)
        setTimeout(() => !ignore && setShowAddContactMessage(false), 5000)
      }

      return () => {
        ignore = true
        setShowAddContactMessage(false)
      }
    }, [postContactData, setShowAddContactMessage])

    const fromContactIdState = useInput('')

    return {
      pagination,

      contacts,
      isFetchingContacts: getContactsIsLoading,
      fetchContacts,
      fetchContactsError: getContactsError,

      fetchContactsQuietly,
      fetchContactsQuietlyError: getContactsError2,

      addContact,
      addContactData: postContactData,
      addContactError: postContactError,
      showAddContactMessage,

      starContact,
      starContactError: putContactError,

      removeContacts: removeContact,
      removeContactError: deleteContactError,

      addContactToGroup,
      addContactToGroupData: postContactToGroupData,
      addContactToGroupError: postContactToGroupError,

      exportContacts,
      exportContactsStatus,
      exportStatusError: getExportStatusError,

      mergeContacts,
      mergeContactsData: postMergeContactsData,
      mergeContactsError: postMergeContactsError,

      removeContactsFromGroup,
      removeContactsFromGroupData: deleteContactsFromGroupData,
      removeContactsFromGroupError: deleteContactsFromGroupError,

      fromContactIdState,
    }
  },
)
