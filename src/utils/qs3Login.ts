import cookie from 'js-cookie'

const authKeyKey = 'authKey'
const rememberNameKey = 'rememberMe'

const apiKeyKey = '@apiKey@'
const validAuthKeyKey = '@authKey@'
const accountNameKey = '@accountName@'
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
const GET_USER_URL = 'https://api.waiverforever.com/api/v3/auth/getUser'

export function getIsAuthored () {
  const authKey = cookie.get(authKeyKey)
  const validAuthKey = window.localStorage.getItem(validAuthKeyKey)
  const apiKey = window.localStorage.getItem(apiKeyKey)

  return apiKey && validAuthKey && validAuthKey === authKey
}

export function getFallbackUsername () {
  return cookie.get(rememberNameKey) || ''
}

export async function exchangeAPIKey () {
  const authKey = cookie.get(authKeyKey)

  if (!authKey) {
    clean()
    throw Error('Request login')
  }

  if (!getIsAuthored()) {
    cleanCRMInfo()

    const requestOption = {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }

    const [ApiKeyResponse, UserResponse] = await Promise.all([
      fetch(API_KEY_URL,requestOption),
      fetch(GET_USER_URL,requestOption),
    ]).catch(() => Promise.reject('Request fails'))

    if (!ApiKeyResponse.ok || !UserResponse.ok) throw Error(ApiKeyResponse.statusText || UserResponse.statusText)

    const [apiKeyData, userData] = await Promise.all([ApiKeyResponse.json(), UserResponse.json()])

    const { success: apiKeySuccess, result: apiKeyResult } = apiKeyData

    if (apiKeyResult !== true || !apiKeySuccess || !apiKeySuccess.apiKey) {
      throw Error('Some errors happened')
    }

    const { success: userSuccess, result: userResult } = userData

    if (userResult !== true || !userSuccess || !userSuccess.username) {
      throw Error('Some errors happened')
    }

    window.localStorage.setItem(apiKeyKey, apiKeySuccess.apiKey)
    window.localStorage.setItem(accountNameKey, userSuccess.username)

    window.localStorage.setItem(validAuthKeyKey, authKey)
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
  window.localStorage.removeItem(apiKeyKey)
}

export function clean () {
  cleanCRMInfo()

  cookie.remove(authKeyKey)
  window.localStorage.removeItem(accountNameKey)
}

export function getCRMToken () {
  return window.localStorage.getItem(crmTokenKey) || ''
}

export function getLoginParams () {
  if (isDev) return devLoginInfo

  return {
    email: window.localStorage.getItem(accountNameKey),
    api_key: window.localStorage.getItem(apiKeyKey),
    password: '',
  }
}
