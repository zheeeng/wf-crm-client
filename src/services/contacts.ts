import { Pagination } from '~src/types/Pagination'
import { Contact, ApiPeople, inputAdapter } from '~src/types/Contact'
import createStore from '@roundation/store'
import fetch, { getQuery } from '~src/utils/fetch'

const store = createStore(setState => ({
  fetching: false,
  contacts: [] as Contact[],
  page: 0,
  size: 0,
  total: 0,
  async fetchContacts (search: object = {}) {
    setState({ fetching: true })

    const searchCondition = Object.assign({ page: 1, size: 30 }, search)

    try {
      const { pagination, result } = await fetch<{ pagination: Pagination, result: ApiPeople[] }>(
        `/api/people${getQuery(searchCondition)}`,
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
}))

export default store
