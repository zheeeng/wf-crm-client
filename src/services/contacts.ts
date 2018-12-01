import { Pagination } from '~src/types/Pagination'
import { Contact, PeopleAPI, ContactAPI, contactInputAdapter, contactFieldAdapter } from '~src/types/Contact'
import createStore from '@roundation/store'
import fetch, { getQuery } from '~src/utils/fetch'

const store = createStore(setState => ({
  fetching: false,
  contacts: [] as Contact[],
  page: 0,
  size: 0,
  total: 0,
  async fetchContacts (search: { page?: number, pageSize?: number, searchTerm?: string } = {}) {
    setState({ fetching: true })

    const searchCondition = Object.assign({ page: 1, size: 30 }, search)

    try {
      const ulr = searchCondition.searchTerm ? '/api/people/search' : '/api/people'

      const { pagination, result } = await fetch<{ pagination: Pagination, result: PeopleAPI[] }>(
        `${ulr}${getQuery(searchCondition)}`,
      )

      setState({
        ...pagination,
        contacts: result.map(contactInputAdapter),
      })
    } catch {
    } finally {
      setState({ fetching: false })
    }
  },
  async addContact (contact: ContactAPI) {
    const result = await fetch<PeopleAPI>('/api/people', {
      method: 'POST',
      body: JSON.stringify(contactFieldAdapter(contact)),
    })
  },
  async starContact (id: string, star: boolean) {
    const result = await fetch<PeopleAPI>(`/api/people/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ favourite: star }),
    })
    const contact = contactInputAdapter(result)
    setState(state => ({
      contacts: state.contacts.map(c => c.id === contact.id ? contact : c),
    }))
  },
}))

export default store
