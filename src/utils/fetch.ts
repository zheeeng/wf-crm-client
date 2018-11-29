type ArgumentsType<F> = F extends (...args: infer A) => any ? A : any

export default async function fetchData<T> (...args: ArgumentsType<typeof fetch>): Promise<T> {
  const [first, second] = args
  const Authorization = window.localStorage.getItem('@token@') || ''

  if (first === '/api/auth/authToken') {
    if (Authorization) {
      await fetchData('/api/auth/validateToken')

      return {} as any
    }

    throw Error('Auth failed.')
  }

  const response = await fetch(
    `https://crm-api-dev.waiverforeverk8s.com${first}`,
    {
      ...second,
      headers: {
        ...(second || {}).headers,
        Authorization,
      },
    },
  )

  if (!response.ok) throw Error(response.statusText)

  const data = await response.json()

  const { account, id, token, username } = data
  if (account) window.localStorage.setItem('@account@', account)
  if (id) window.localStorage.setItem('@id@', id)
  if (token) window.localStorage.setItem('@token@', token)
  if (username) window.localStorage.setItem('@username@', username)

  if (first === '/api/auth/invalidateToken') {
    window.localStorage.removeItem('@account@')
    window.localStorage.removeItem('@id@')
    window.localStorage.removeItem('@token@')
    window.localStorage.removeItem('@username@')
  }

  return data
}

export const getQuery = (query: object): string => {
  const search = Object.keys(query)
    .filter(key => query[key])
    .map(key => `${key}=${encodeURIComponent(query[key])}`).join('&')

  return search ? `?${search}` : search
}
