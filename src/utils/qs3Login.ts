import cookie from 'js-cookie'

const authKeyKey = 'authKey'
const rememberNameKey = 'rememberMe'

const apiKeyKey = '@apiKey@'
const accountNameKey = '@accountName@'
const crmAccountKey = '@account@'
const crmIdKey = '@id@'
const crmTokenKey = '@token@'
const crmUsernameKey = '@username@'

const isDev = process.env.NODE_ENV === 'development'

const devLoginInfo = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  api_key: '',
  email: 'a',
  password: '0cc175b9c0f1b6a831c399e269772661',
}
const API_KEY_URL = 'https://api.waiverforever.com/api/v3/accountSettings/getAPIKey'
const GET_USER_URL = 'https://api.waiverforever.com/api/v3/auth/getUser'

export function cleanStorage () {
  window.localStorage.removeItem(crmAccountKey)
  window.localStorage.removeItem(crmIdKey)
  window.localStorage.removeItem(crmTokenKey)
  window.localStorage.removeItem(crmUsernameKey)
  window.localStorage.removeItem(apiKeyKey)
  window.localStorage.removeItem(accountNameKey)
}

export function getCRMToken () {
  return window.localStorage.getItem(crmTokenKey) || ''
}

export function getLoginParams () {
  if (isDev) return devLoginInfo

  return {
    email: window.localStorage.getItem(accountNameKey),
    // eslint-disable-next-line @typescript-eslint/camelcase
    api_key: window.localStorage.getItem(apiKeyKey),
    password: '',
  }
}

export function getFallbackUsername () {
  return window.localStorage.getItem(crmUsernameKey)
    || window.localStorage.getItem(accountNameKey)
    || cookie.get(rememberNameKey) || ''
}

export async function exchangeAPIKey () {
  const authKey = cookie.get(authKeyKey)

  if (!authKey) {
    cleanStorage()
    throw Error('Request login')
  }

  const requestOption = {
    headers: {
      Authorization: `Bearer ${authKey}`,
    },
  }

  // Block 1: request main app userName
  // This userName is email format
  let userName!: string
  {
    const UserResponse = await fetch(GET_USER_URL, requestOption)

    if (!UserResponse.ok) throw Error(UserResponse.statusText)

    const userData = await UserResponse.json()

    const { success: userSuccess, result: userResult } = userData

    if (userResult !== true || !userSuccess || !userSuccess.username) {
      throw Error('Some errors happened')
    }

    userName = userSuccess.username
  }

  // Block 2: check email is same with previous one, if true, we assume apiKey is validated
  {
    const email = window.localStorage.getItem(accountNameKey)

    if (email === userName) return
  }

  // Block 3: fetch fresh API key
  let apiKey!: string
  {
    const ApiKeyResponse = await fetch(API_KEY_URL, requestOption)

    if (!ApiKeyResponse.ok) throw Error(ApiKeyResponse.statusText)

    const apiKeyData = await ApiKeyResponse.json()

    const { success: apiKeySuccess, result: apiKeyResult } = apiKeyData

    if (apiKeyResult !== true || !apiKeySuccess || !apiKeySuccess.apiKey) {
      throw Error('Some errors happened')
    }

    apiKey = apiKeySuccess.apiKey
  }

  // Block 4: store data
  // eslint-disable-next-line no-lone-blocks
  {
    cleanStorage()

    window.localStorage.setItem(apiKeyKey, apiKey)
    window.localStorage.setItem(accountNameKey, userName)
  }
}

export function persistLoginInfo (account: string, id: string, token: string, username: string) {
  if (account) window.localStorage.setItem(crmAccountKey, account)
  if (id) window.localStorage.setItem(crmIdKey, id)
  if (token) window.localStorage.setItem(crmTokenKey, token)
  if (username) window.localStorage.setItem(crmUsernameKey, username)
}
