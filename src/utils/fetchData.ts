type Option = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  params?: object,
}

const pascal2snake = (str: string) => str.replace(/([A-Z])/g, '_$1').toLowerCase()

export const getQuery = (query: object): string => {
  const search = Object.keys(query)
    .filter(key => query[key])
    .map(key => `${pascal2snake(key)}=${encodeURIComponent(query[key])}`).join('&')

  return search ? `?${search}` : search
}

export default async function fetchData<T = any> (url: string, option?: Option): Promise<T | null> {
  const fetchOption = Object.assign({ method: 'GET' }, option)

  const Authorization = window.localStorage.getItem('@token@') || ''

  if (url === '/api/auth/authToken') {
    if (Authorization) {
      const validationInfo = await fetchData('/api/auth/validateToken')

      return validationInfo
    }

    throw Error('Auth failed.')
  }

  const requestUrl = `https://crm-api-dev.waiverforeverk8s.com${url}`
  const query = (fetchOption.method && ['GET', 'HEAD'].includes(fetchOption.method || '') && fetchOption.params)
    ? getQuery(fetchOption.params) : ''
  const method = fetchOption.method
  const headers = { Authorization }
  const body = (fetchOption.method !== 'GET' && fetchOption.params) ? JSON.stringify(fetchOption.params) : ''

  const response = await fetch(`${requestUrl}${query}`, { method, headers, ...(body ? { body } : {}) })

  if (!response.ok) return null

  const data = await response.json()

  const { account, id, token, username } = data
  if (account) window.localStorage.setItem('@account@', account)
  if (id) window.localStorage.setItem('@id@', id)
  if (token) window.localStorage.setItem('@token@', token)
  if (username) window.localStorage.setItem('@username@', username)

  if (url === '/api/auth/invalidateToken') {
    window.localStorage.removeItem('@account@')
    window.localStorage.removeItem('@id@')
    window.localStorage.removeItem('@token@')
    window.localStorage.removeItem('@username@')
  }

  return data
}
