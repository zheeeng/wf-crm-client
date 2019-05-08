import cookie from 'js-cookie'

const apiKeyKey = 'apiKey'
const authKeyKey = 'authKey'
const accountNameKey = 'rememberMe'

const API_KEY_URL = 'https://api.waiverforever.com/api/v3/accountSettings/getAPIKey'

export async function exchangeAPIKey () {
  const authKey = cookie.get(authKeyKey)
  if (!authKey) throw Error('No authKey')
  const response = await fetch(API_KEY_URL,
    {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  )

  if (!response.ok) throw Error(response.statusText)

  const data = await response.json()

  const { success, result } = data

  if (result != true || !success || !success.apiKey) {
    throw Error('Some errors happened')
  }

  cookie.set(apiKeyKey, success.apiKey)
}

export function clean () {
  cookie.remove(apiKeyKey)
  cookie.remove(authKeyKey)
  cookie.remove(accountNameKey)
}

export function getLoginParams () {
  return {
    email: cookie.get(accountNameKey),
    api_key: cookie.get(apiKeyKey),
    password: '',
  }
}
