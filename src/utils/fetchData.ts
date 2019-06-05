import { cleanStorage, persistLoginInfo, getCRMToken } from '~src/utils/qs3Login'
import { pascal2snake } from '~src/utils/caseConvert'

type Option = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: object
}

export const getQuery = (query: object): string => {
  const search = Object.entries(query)
    .filter(([, v]) => v)
    .map(([k, v]) => `${pascal2snake(k)}=${encodeURIComponent(v)}`).join('&')

  return search ? `?${search}` : search
}

const base = process.env.NODE_ENV === 'development'
  ? 'https://crm-api-dev.waiverforeverk8s.com'
  : 'https://crm-api.waiverforeverk8s.com'

export default async function fetchData<T> (url: string, option?: Option): Promise<T> {
  const fetchOption = Object.assign({ method: 'GET' }, option)

  const Authorization = getCRMToken()

  const requestUrl = `${base}${url}`
  const query = (fetchOption.method && ['GET', 'HEAD'].includes(fetchOption.method || '') && fetchOption.params)
    ? getQuery(fetchOption.params)
    : ''
  const method = fetchOption.method
  const headers = { Authorization }
  const body = (fetchOption.method !== 'GET' && fetchOption.params) ? JSON.stringify(fetchOption.params) : ''

  const response = await fetch(`${requestUrl}${query}`, { method, headers, ...(body ? { body } : {}) })

  if (!response.ok) {
    const errorMessage = await response.json()

    throw errorMessage
  }

  const data = await response.json()

  const { account, id, token, username } = data
  persistLoginInfo(account, id, token, username)

  if (url === '/api/auth/invalidateToken') {
    cleanStorage()
  }

  return data
}
