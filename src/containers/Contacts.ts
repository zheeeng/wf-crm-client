import { useCallback, useContext, useMemo } from 'react'
import createContainer from 'constate'
import { Pagination } from '~src/types/Pagination'
import { PeopleAPI, ContactAPI, contactInputAdapter, Contact, contactFieldAdapter } from '~src/types/Contact'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import useDepMemo from '~src/hooks/useDepMemo'
import useInfoCallback from '~src/hooks/useInfoCallback'
import pipe from 'ramda/es/pipe'
import prop from 'ramda/es/prop'
import head from 'ramda/es/head'
import map from 'ramda/es/map'
import defaultTo from 'ramda/es/defaultTo'
import ContactsCountContainer from './ContactsCount'

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
  defaultTo({ pagination: { page: 0, size: 0, total: 0 }, result: [] }),
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
  defaultTo({ pagination: { page: 0, size: 0, total: 0 }, result: [] }),
  prop('result'),
  map(contactInputAdapter),
)

const ContactsContainer = createContainer(() => {
  const { refreshCounts } = useContext(ContactsCountContainer.Context)

  const { data: contactsData, request: getContacts, error: getContactsError } = useGet<ContactsResponse>()
  const { request: deleteContact, error: deleteContactError } = useDelete()

  const { request: postContact, error: postContactError } = usePost()
  const { request: putContact, error: putContactError } = usePut()

  const pagination = useDepMemo(convertPagination, [contactsData])
  const contacts = useDepMemo(convertContacts, [contactsData])

  const fetchContacts = useCallback(
    async (params: FetchParams) => {
      await getContacts('/api/people/search')(params)
    },
    [],
  )

  const [addContact, addMutation] = useInfoCallback(
    async (contact: ContactAPI) => {
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

  return {
    pagination,
    contacts,
    fetchContacts, fetchContactsError: getContactsError,
    addContact, addMutation, addContactError: postContactError,
    starContact, starMutation, starContactError: putContactError,
    removeContacts, removeMutation, removeContactError,
  }
})

export default ContactsContainer
