import { useCallback, useContext } from 'react'
import { Pagination } from '~src/types/Pagination'
import { PeopleAPI, ContactAPI, contactInputAdapter, Contact, contactFieldAdapter } from '~src/types/Contact'
import { useGet, usePost, usePut } from '~src/hooks/useRequest'
import useDepMemo from '~src/hooks/useDepMemo'
import useInfoCallback from '~src/hooks/useInfoCallback'
import pipe from 'ramda/src/pipe'
import prop from 'ramda/src/prop'
import head from 'ramda/src/head'
import map from 'ramda/src/map'
import defaultTo from 'ramda/src/defaultTo'
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
  ContactsResponse['pagination']
>(
  head,
  defaultTo({ pagination: { page: 0, size: 0, total: 0 } }),
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
  defaultTo({ result: [] }),
  prop('result'),
  map(contactInputAdapter),
)

const useContacts = () => {
  const { refreshCounts } = useContext(ContactsCountContainer.Context)

  const { data: contactsData, request: getContacts } = useGet<ContactsResponse>()

  const { request: postContact } = usePost()
  const { request: putContact } = usePut()

  const pagination = useDepMemo<Pagination>(convertPagination, [contactsData])
  const contacts = useDepMemo<Contact[]>(convertContacts, [contactsData])

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

  return {
    pagination,
    contacts,
    fetchContacts,
    addContact, addMutation,
    starContact, starMutation,
  }
}

export default useContacts
