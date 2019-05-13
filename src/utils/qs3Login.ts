import cookie from 'js-cookie'

const apiKeyKey = 'apiKey'
const authKeyKey = 'authKey'
const accountNameKey = 'rememberMe'

const isDev = process.env.NODE_ENV === 'development'
const devLoginInfo = {
  api_key: '',
  email: 'a',
  password: '0cc175b9c0f1b6a831c399e269772661',
}
const API_KEY_URL = 'https://api.waiverforever.com/api/v3/accountSettings/getAPIKey'

export async function exchangeAPIKey () {
  if (location.search.includes('email=jeff@riversportsoutfitters.com')) {
    const apiKey = '1ffab6ce897009de7bb6db8ddcdbf69b'
    cookie.set(apiKeyKey, apiKey)
    cookie.set(accountNameKey, 'jeff@riversportsoutfitters.com')
    return
  } else if (location.search.includes('email=vegasicon@gmail.com')) {
    const apiKey = '76823457cbac692928d64ca0b99e5782'
    cookie.set(apiKeyKey, apiKey)
    cookie.set(accountNameKey, 'jvegasicon@gmail.com')
    return
  } else if (location.search.includes('email=samsnba02@gmail.com')) {
    const apiKey = 'e3312e200523c825887536d25b32a1f6'
    cookie.set(apiKeyKey, apiKey)
    cookie.set(accountNameKey, 'samsnba02@gmail.com')
    return
  } else if (location.search.includes('email=jools@stayontarget.uk')) {
    const apiKey = '5c634f3a9b2815ae19ef6807a4b3bce5'
    cookie.set(apiKeyKey, apiKey)
    cookie.set(accountNameKey, 'jools@stayontarget.uk')
    return
  } else if (location.search.includes('email=keithnemerow@yahoo.com')) {
    const apiKey = 'f5d1f5fc43d427a2f2368b001af5953d'
    cookie.set(apiKeyKey, apiKey)
    cookie.set(accountNameKey, 'keithnemerow@yahoo.com')
    return
  } else if (location.search.includes('email=dwayne@midnightproduction.com')) {
    const apiKey = '8325d11e4c9a5f8cdeb0658f571bb7ac'
    cookie.set(apiKeyKey, apiKey)
    cookie.set(accountNameKey, 'dwayne@midnightproduction.com')
    return
  }

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
  if (isDev) return devLoginInfo

  return {
    email: cookie.get(accountNameKey),
    api_key: cookie.get(apiKeyKey),
    password: '',
  }
}
