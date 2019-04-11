import { useCallback, useContext, useMemo, useEffect } from 'react'
import createContainer from 'constate'
import { Pagination } from '~src/types/Pagination'
import { PeopleAPI, ContactFields, contactInputAdapter, Contact, contactFieldAdapter } from '~src/types/Contact'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import useDepMemo from '~src/hooks/useDepMemo'
import useInfoCallback from '~src/hooks/useInfoCallback'
import pipe from 'ramda/es/pipe'
import prop from 'ramda/es/prop'
import head from 'ramda/es/head'
import map from 'ramda/es/map'
import defaultTo from 'ramda/es/defaultTo'
import ContactsCountContainer from './ContactsCount'
import sleep from '~src/utils/sleep'
import downloadFile from '~src/utils/downloadFile'

type FetchParams = {
  page?: number,
  size?: number,
  searchTerm?: string,
  favourite?: boolean,
  groupId?: string,
}
type ContactsResponse = { pagination: Pagination, result: PeopleAPI[] }

const convertPagination = pipe<
  Array<ContactsResponse | null>,
  ContactsResponse | null,
  ContactsResponse,
  Pagination
>(
  head,
  defaultTo({ pagination: { page: 1, size: 0, total: 0 }, result: [] }),
  prop('pagination'),
)

const convertContacts = pipe<
  Array<ContactsResponse | null>,
  ContactsResponse | null,
  ContactsResponse,
  ContactsResponse['result'],
  Contact[]
>(
  head,
  defaultTo({ pagination: { page: 1, size: 0, total: 0 }, result: [] }),
  prop('result'),
  map(contactInputAdapter),
)

const ContactsContainer = createContainer(() => {
  const { refreshCounts } = useContext(ContactsCountContainer.Context)

  const { data: contactsData, request: getContacts, error: getContactsError } = useGet<ContactsResponse>()
  const { request: deleteContact, error: deleteContactError } = useDelete()

  const { data: postContactData, request: postContact, error: postContactError } = usePost()
  const { request: putContact, error: putContactError } = usePut()
  const { data: postContactToGroupData, request: postContactToGroup, error: postContactToGroupError } = usePost()

  const {
    data: postMergeContactsData,
    request: postMergeContacts,
    error: postMergeContactsError,
  } = usePost<PeopleAPI>()
  const { request: postExportContacts } = usePost<{ task_id: string }>()
  const { request: getExportStatus, data: exportContactsStatus, error: getExportStatusError } = useGet<{
    id: string,
    ready: boolean,
    status: string,
    result?: {
      url: string,
    },
  }>()

  const pagination = useDepMemo(convertPagination, [contactsData])
  const contacts = useDepMemo(convertContacts, [contactsData])

  const fetchContacts = useCallback(
    async (params: FetchParams) => {
      await getContacts('/api/people/search')(params)
    },
    [],
  )

  const [addContact, addMutation] = useInfoCallback(
    async (contact: ContactFields) => {
      await postContact('/api/people')(contactFieldAdapter(contact))
      refreshCounts()
    },
    [],
  )

  const [starContact, starMutation] = useInfoCallback(
    async (id: string, star: boolean) => {
      await putContact(`/api/people/${id}`)({ favourite: star })
      refreshCounts()
    },
    [],
  )

  const [removeContacts, removeMutation] = useInfoCallback(
    async (contactIds: string[]) => {
      await contactIds.reduce(
        async (p, id) => {
          await p,
          await deleteContact(`/api/people/${id}`)()
        },
        Promise.resolve(),
      )
      refreshCounts()
    },
    [],
  )

  const removeContactError = useMemo(
    () => {
      // tslint:disable-next-line:no-construct
      if (deleteContactError) return new String(deleteContactError.message)

      return null
    },
    [deleteContactError],
  )

  const addContactToGroup = useCallback(
    async (groupId: string, contactIds: string[]) => {
      await postContactToGroup(`/api/group/${groupId}/people`)({
        people: contactIds,
      })
    },
    [postContactToGroup],
  )

  const mergeContacts = useCallback(
    async ([targetId, ...sourceIds]: string[]) => {
      let latestResponse: Promise<PeopleAPI | null>

      const response = await sourceIds.reduce(
        async (chain, sId) => {
          try {
            await chain
            latestResponse = postMergeContacts(`/api/people/${targetId}/mergePerson/${sId}`)()
          } finally {
            // tslint:disable-next-line:no-unsafe-finally
            return latestResponse
          }
        },
        Promise.resolve() as any as Promise<PeopleAPI | null>,
      )

      refreshCounts()

      return contactInputAdapter(response!)
    },
    [],
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

        while (statusResponse && statusResponse.status === 'pending') {
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

  return {
    pagination,
    contacts,
    fetchContacts, fetchContactsError: getContactsError,
    addContactData: postContactData, addContact, addMutation, addContactError: postContactError,
    starContact, starMutation, starContactError: putContactError,
    removeContacts, removeMutation, removeContactError,
    addContactToGroupData: postContactToGroupData, addContactToGroup, addContactToGroupError: postContactToGroupError,
    exportContacts, exportContactsStatus, exportStatusError: getExportStatusError,
    mergeContactsData: postMergeContactsData, mergeContacts, mergeContactsError: postMergeContactsError,
  }
})

export default ContactsContainer
