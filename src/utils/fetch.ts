type ArgumentsType<F> = F extends (...args: infer A) => any ? A : any

export default async function fetchData<T> (...args: ArgumentsType<typeof fetch>): Promise<T> {
  const [first, second] = args
  const Authorization = window.localStorage.getItem('@token@') || ''

  const response = await fetch(
    first,
    {
      ...second,
      headers: {
        ...(second || {}).headers,
        Authorization,
      },
    },
  )

  const data = response.json()

  const { account, id, token, username } = data as any
  if (account) window.localStorage.setItem('@account@', account)
  if (id) window.localStorage.setItem('@id@', id)
  if (token) window.localStorage.setItem('@token@', token)
  if (username) window.localStorage.setItem('@username@', username)

  return data
}
