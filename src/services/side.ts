import { Pagination } from '~src/types/Pagination'
import createStore from '@roundation/store'
import fetch, { getQuery } from '~src/utils/fetch'

const fetchCountHelper = async (favourite: boolean) => {
  const url = '/api/people/search'
  const searchCondition = favourite ? { page: 1, size: 1, favourite: true } : { page: 1, size: 1 }

  const { pagination } = await fetch<{ pagination: Pagination }>(
    `${url}${getQuery(searchCondition)}`,
  )

  return pagination.total
}

const store = createStore(setState => ({
  allCount: 0,
  starredCount: 0,
  async fetchInitialCount () {
    try {
      await Promise.all([
        fetchCountHelper(false).then(allCount => {
          setState({ allCount })
        }),
        fetchCountHelper(true).then(starredCount => {
          setState({ starredCount })
        }),
      ])
    } catch {}
  },
  async fetchAllCount () {
    try {
      const allCount = await fetchCountHelper(false)

      setState({ allCount })
    } catch {
    }
  },
  async fetchStarredCount () {
    try {
      const starredCount = await fetchCountHelper(true)

      setState({ starredCount })
    } catch {
    }
  },
}))

export default store
