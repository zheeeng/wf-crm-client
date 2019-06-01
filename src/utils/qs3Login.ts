import cookie from 'js-cookie'

const apiKeyKey = 'apiKey'
const authKeyKey = 'authKey'
const validAuthKeyKey = '_authKey'
const accountNameKey = 'rememberMe'

const crmAccountKey = '@account@'
const crmIdKey = '@id@'
const crmTokenKey = '@token@'
const crmUsernameKey = '@username@'

const isDev = process.env.NODE_ENV === 'development'
const devLoginInfo = {
  api_key: '',
  email: 'a',
  password: '0cc175b9c0f1b6a831c399e269772661',
}
const API_KEY_URL = 'https://api.waiverforever.com/api/v3/accountSettings/getAPIKey'

export function getIsAuthored () {
  const validAuthKey = cookie.get(validAuthKeyKey)
  const authKey = cookie.get(authKeyKey)
  const apiKey = cookie.get(apiKeyKey)

  return apiKey && validAuthKey && validAuthKey === authKey
}

export function getFallbackUsername () {
  return cookie.get(accountNameKey) || ''
}

export async function exchangeAPIKey () {
  const authKey = cookie.get(authKeyKey)

  if (!authKey) {
    clean()
    throw Error('Request login')
  }

  if (!getIsAuthored()) {
    cleanCRMInfo()

    const response = await fetch(
      API_KEY_URL,
      {
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      },
    )

    if (!response.ok) throw Error(response.statusText)

    const data = await response.json()

    const { success, result } = data

    if (result !== true || !success || !success.apiKey) {
      throw Error('Some errors happened')
    }

    cookie.set(apiKeyKey, success.apiKey)

    cookie.set(validAuthKeyKey, authKey)
  }
}

export function persistLoginInfo (account: string, id: string, token: string, username: string) {
  if (account) window.localStorage.setItem(crmAccountKey, account)
  if (id) window.localStorage.setItem(crmIdKey, id)
  if (token) window.localStorage.setItem(crmTokenKey, token)
  if (username) window.localStorage.setItem(crmUsernameKey, username)
}

export function cleanCRMInfo () {
  window.localStorage.removeItem(crmAccountKey)
  window.localStorage.removeItem(crmIdKey)
  window.localStorage.removeItem(crmTokenKey)
  window.localStorage.removeItem(crmUsernameKey)
}

export function clean () {
  cleanCRMInfo()

  cookie.remove(apiKeyKey)
  cookie.remove(authKeyKey)
  cookie.remove(accountNameKey)
}

export function getCRMToken () {
  return window.localStorage.getItem('@token@') || ''
}

export function getLoginParams () {
  if (isDev) return devLoginInfo

  return {
    email: cookie.get(accountNameKey),
    api_key: cookie.get(apiKeyKey),
    password: '',
  }
}
