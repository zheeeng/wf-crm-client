import React, { useState, useCallback, useContext, useMemo, useEffect } from 'react'

import createContainer from 'constate'
import { Pagination } from '~src/types/Pagination'
import { PeopleAPI, ContactFields, contactInputAdapter, Contact, contactFieldAdapter } from '~src/types/Contact'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import useInfoCallback from '~src/hooks/useInfoCallback'
import pipe from 'ramda/es/pipe'
import prop from 'ramda/es/prop'
import head from 'ramda/es/head'
import map from 'ramda/es/map'
import defaultTo from 'ramda/es/defaultTo'

import CheckCircle from '@material-ui/icons/CheckCircleOutline'

import ContactsCountContainer from './ContactsCount'
import AlertContainer from './Alert'
import sleep from '~src/utils/sleep'
import downloadFile from '~src/utils/downloadFile'
import useLatest from '~src/hooks/useLatest'
import useDidUpdate from '~src/hooks/useDidUpdate'

type FetchParams = {
  page?: number,
  size?: number,
  searchTerm?: string,
  favourite?: boolean,
  groupId?: string,
}
type ContactsResponse = { pagination: Pagination, result: PeopleAPI[] }

type ContainerProps = {
  page?: number,
  size?: number,
  searchTerm?: string,
  favourite?: boolean,
  groupId?: string,
}

const ContactsContainer = createContainer(({
  page = 1, size = 30, searchTerm = '', groupId = '', favourite = false,
}: ContainerProps) => {
  const { refreshCounts, refreshPageMutation } = useContext(ContactsCountContainer.Context)

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

  const { data: postContactData, request: postContact, error: postContactError } = usePost()
  const { request: putContact, error: putContactError } = usePut()
  const { data: postContactToGroupData, request: postContactToGroup, error: postContactToGroupError } = usePost()

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
  const { request: getExportStatus, data: exportContactsStatus, error: getExportStatusError } = useGet<{
    id: string,
    ready: boolean,
    status: string,
    result?: {
      url: string,
    },
  }>()

  const latestContactsData = useLatest(contactsData, contactsData2)

  const pagination = useMemo<Pagination>(
    () => latestContactsData
      ? latestContactsData.pagination
      : { page, size: 0, total: 0 },
    [latestContactsData, page]
  )

  const contacts = useMemo<Contact[]>(
    () => (
      latestContactsData
        ? latestContactsData.result
        : []
    ).map(contactInputAdapter),
    [latestContactsData],
  )

  const fetchContacts = useCallback(
    async (size: number, pageNumber?: number) => {
      const params: FetchParams = {
        page: pageNumber || page,
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
    [getContacts, page, favourite, groupId, searchTerm],
  )

  const [addContact, addMutation] = useInfoCallback(
    async (contact: ContactFields) => {
      const contactData = favourite ? { ...contact, favourite } : contact
      await postContact('/api/people')(contactFieldAdapter(contactData))
    },
    [postContact],
  )

  const [starContact, starMutation] = useInfoCallback(
    async (id: string, star: boolean) => {
      await putContact(`/api/people/${id}`)({ favourite: star })
    },
    [putContact],
  )

  const [removeContacts, removeMutation] = useInfoCallback(
    async (contactIds: string[]) => {
      return await contactIds.reduce(
        async (p, id) => {
          await p,
          await deleteContact(`/api/people/${id}`)()
        },
        Promise.resolve(),
      )
    },
    [deleteContact],
  )

  const removeContactError = useMemo(
    () => {
      // tslint:disable-next-line:no-construct
      if (deleteContactError) return new String(deleteContactError.message)

      return null
    },
    [deleteContactError],
  )

  const [addContactToGroup, addContactToGroupMutation] = useInfoCallback(
    async (groupId: string, contactIds: string[]) => {
      await postContactToGroup(`/api/group/${groupId}/people`)({
        people: contactIds,
      })
    },
    [postContactToGroup],
  )

  const [removeContactsFromGroup, removeContactsFromGroupMutation] = useInfoCallback(
    async (groupId: string, contactIds: string[]) => {
      await deleteContactsFromGroup(`/api/group/${groupId}/people`)({
        people: contactIds,
      })
    },
    [deleteContactsFromGroup],
  )

  const [mergeContacts, mergeContactsMutation] = useInfoCallback(
    async ([targetId, ...sourceIds]: string[]) => {
      return await sourceIds.reduce(
        async (chain, sourceId) => {
          try {
            await chain
            return await postMergeContacts(`/api/people/${targetId}/mergePerson/${sourceId}`)()
          } catch {
            return Promise.resolve()
          }
        },
        Promise.resolve() as Promise<any>,
      )
    },
    [postMergeContacts],
  )

  const exportContacts = useCallback(
    async (contactIds: string[]) => {
      const response = await postExportContacts('/api/backgroundTasks/exportPeople')({
        query: {
          id: contactIds,
        },
      })

      if (response) {
        const taskId = response.task_id

        let statusResponse = await getExportStatus(`/api/backgroundTasks/checkStatus/${taskId}`)()


        while (statusResponse && statusResponse.status === 'PENDING') {
          await sleep(2000)
          statusResponse = await getExportStatus(`/api/backgroundTasks/checkStatus/${taskId}`)()
        }

        if (statusResponse && statusResponse.ready === true
          && statusResponse.result && statusResponse.result.url) {
            downloadFile(statusResponse.result.url)
        }
      }
    },
    [postExportContacts],
  )

  useEffect(
    () => {
      refreshCounts()
    },
    [addMutation, starMutation, removeMutation, mergeContactsMutation],
  )

  // alter effects
  {
    const { success, fail } = useContext(AlertContainer.Context)

    useEffect(
      () => {
        if (exportContactsStatus && exportContactsStatus.ready === true) {
          success(<><CheckCircle /> Contacts Exported</>)
        }
      },
      [exportContactsStatus],
    )

    useEffect(
      () => { getExportStatusError && fail(getExportStatusError.message) },
      [getExportStatusError],
    )

    useEffect(
      () => { postContactError && fail(postContactError.message) },
      [postContactError],
    )

    useEffect(
      () => { putContactError && fail(putContactError.message) },
      [putContactError],
    )
    // useEffect(
    //   () => { removeContactData && success(<><CheckCircle /> Contacts Removed</>) },
    //   [removeContactData],
    // )
    // useEffect(
    //   () => { removeContactError && fail(removeContactError.message) },
    //   [removeContactError],
    // )
    useEffect(
      () => { postContactToGroupData && success(<><CheckCircle /> Contacts Added</>) },
      [postContactToGroupData],
    )
    useEffect(
      () => { postContactToGroupError && fail(postContactToGroupError.message) },
      [postContactToGroupError],
    )
    useEffect(
      () => { postMergeContactsData && success(<><CheckCircle /> Contacts Merged</>) },
      [postMergeContactsData],
    )
    useEffect(
      () => { postMergeContactsError && fail(postMergeContactsError.message) },
      [postMergeContactsError],
    )
    useEffect(
      () => { deleteContactsFromGroupData && success(<><CheckCircle /> Contacts Removed From Group</>) },
      [deleteContactsFromGroupData],
    )
    useEffect(
      () => { deleteContactsFromGroupError && fail(deleteContactsFromGroupError.message) },
      [deleteContactsFromGroupError]
    )

    useDidUpdate(
      () => { fetchContactsQuietly(30) },
      [starMutation]
    )

    useDidUpdate(
      () => { fetchContacts(30, 1) },
      [addMutation, removeMutation, refreshPageMutation, mergeContactsMutation, removeContactsFromGroupMutation]
    )
  }

  const [showAddContactMessage, setShowAddContactMessage] = useState(false)

  useEffect(
    () => {
      let ignore = false
      if (postContactData) {
        setShowAddContactMessage(true)
        setTimeout(() => !ignore && setShowAddContactMessage(false), 5000)
      }

      return () => {
        ignore = true
        setShowAddContactMessage(false)
      }
    },
    [postContactData, setShowAddContactMessage],
  )

  const [fromContactId, setFromContactId] = useState('')
  const resetFormContactId = useCallback(
    () => { setFromContactId('') },
    [setFromContactId],
  )

  useEffect(
    () => { fetchContacts(size) },
    [fetchContacts, size]
  )

  return {
    pagination,

    contacts,
    isFetchingContacts: getContactsIsLoading,
    fetchContacts,
    fetchContactsError: getContactsError,

    fetchContactsQuietly,
    fetchContactsQuietlyError: getContactsError2,

    addContact, addMutation,
    addContactData: postContactData,
    addContactError: postContactError,
    showAddContactMessage,

    starContact, starMutation,
    starContactError: putContactError,

    removeContacts, removeMutation,
    removeContactError,

    addContactToGroup, addContactToGroupMutation,
    addContactToGroupData: postContactToGroupData,
    addContactToGroupError: postContactToGroupError,

    exportContacts,
    exportContactsStatus, exportStatusError: getExportStatusError,

    mergeContacts, mergeContactsMutation,
    mergeContactsData: postMergeContactsData,
    mergeContactsError: postMergeContactsError,

    removeContactsFromGroup, removeContactsFromGroupMutation,
    removeContactsFromGroupData: deleteContactsFromGroupData,
    removeContactsFromGroupError: deleteContactsFromGroupError,

    fromContactId, setFromContactId, resetFormContactId,
  }
})

export default ContactsContainer
