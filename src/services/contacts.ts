import { Pagination } from '~src/types/Pagination'
import { Contact, ApiPeople, ApiContact, inputAdapter, outputAdapter } from '~src/types/Contact'
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

      const { pagination, result } = await fetch<{ pagination: Pagination, result: ApiPeople[] }>(
        `${ulr}${getQuery(searchCondition)}`,
      )

      setState({
      ...pagination,
      contacts: result.map(inputAdapter),
      })
    } catch {
    } finally {
      setState({ fetching: false })
    }
  },
  async addContact (contact: ApiContact) {
    const result = await fetch<ApiPeople>('/api/people', {
      method: 'POST',
      body: JSON.stringify(outputAdapter(contact)),
    })
  },
}))

export default store
