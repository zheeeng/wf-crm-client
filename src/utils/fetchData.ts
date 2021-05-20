import {
  cleanStorage,
  persistLoginInfo,
  getCRMToken,
} from '~src/utils/qs3Login'
import { pascal2snake } from '~src/utils/caseConvert'

type Option = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params?: Record<string, unknown>
}

export const getQuery = (query: Record<string, unknown>): string => {
  const search = Object.entries(query)
    .filter(([, v]) => v)
    .map(([k, v]) => `${pascal2snake(k)}=${encodeURIComponent(v as string)}`)
    .join('&')

  return search ? `?${search}` : search
}

const base =
  process.env.NODE_ENV === 'development'
    ? 'https://crm-api.waiverforeverk8s.com'
    : // ? 'https://crm-api.dev-waiverforeverk8s.com'
      'https://crm-api.waiverforeverk8s.com'

export default async function fetchData<T>(
  url: string,
  option?: Option,
): Promise<T> {
  const fetchOption = Object.assign({ method: 'GET' }, option)

  const Authorization = getCRMToken()

  const requestUrl = `${base}${url}`
  const query =
    fetchOption.method &&
    ['GET', 'HEAD'].includes(fetchOption.method ?? '') &&
    fetchOption.params
      ? getQuery(fetchOption.params)
      : ''
  const method = fetchOption.method
  const headers = { Authorization }
  const body =
    fetchOption.method !== 'GET' && fetchOption.params
      ? JSON.stringify(fetchOption.params)
      : ''

  const response = await fetch(`${requestUrl}${query}`, {
    method,
    headers,
    ...(body ? { body } : {}),
  })

  let data: any = null
  let errorMessage = null

  try {
    if (!response.ok) {
      errorMessage = await response.json()
    } else {
      data = await response.json()
    }
  } catch {
    if (response.status >= 500) {
      errorMessage = {
        message:
          response.status === 504 ? 'Gateway timeout' : 'InternalServer Error',
      }
    } else if (response.status >= 400) {
      errorMessage = {
        message: response.status === 404 ? 'Not Found Target' : 'Bad Request',
      }
    }
  }

  if (errorMessage) {
    throw errorMessage
  }

  const { account, id, token, username } = data
  persistLoginInfo(account, id, token, username)

  if (url === '/api/auth/invalidateToken') {
    cleanStorage()
  }

  return data
}
