import cookie from 'js-cookie'

const apiKeyKey = 'apiKey'
const authKeyKey = 'authKey'
const validAuthKeyKey = '_authKey'
const accountNameKey = 'rememberMe'

const isDev = process.env.NODE_ENV === 'development'
const devLoginInfo = {
  api_key: '',
  email: 'a',
  password: '0cc175b9c0f1b6a831c399e269772661',
}
const API_KEY_URL = 'https://api.waiverforever.com/api/v3/accountSettings/getAPIKey'

export async function exchangeAPIKey () {
  const validAuthKey = cookie.get(validAuthKeyKey)
  const authKey = cookie.get(authKeyKey)
  const apiKey = cookie.get(apiKeyKey)

  if (!authKey || (validAuthKey && validAuthKey !== authKey)) {
    cookie.remove(validAuthKeyKey)
    cookie.remove(apiKeyKey)
    throw Error('Request login')
  }

  cookie.set(validAuthKeyKey, authKey)

  if (apiKey) return

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

  if (result !== true || !success || !success.apiKey) {
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


"_ga=GA1.2.841888290.1559366381; _gid=GA1.2.109605956.1559366381; __stripe_mid=a1504fb3-0aa7-4c7f-bf95-2edbd7b5ffbc; __stripe_sid=d2dbcd23-b2c9-4da1-8eb4-f3bfd5bd290b; _hjIncludedInSample=1; rememberMe=a; authKey=fcB5pQxXBvksGxwHuceGv3; intercom-session-rrsp64of=WFhablFyaWxTeGE3MkJuTDJUOU9GbW1GLzQ0VVVxL3RJbU82UG9OVFhCQmpEbElsZnNicjRzRTNpUXhDUW9CUi0taDNNbFZtakdsSXNkNE96eXRtRlJrZz09--287dda113ecc9326325e7dd3a1411f4de07a6c35; _authKey=fcB5pQxXBvksGxwHuceGv3"
