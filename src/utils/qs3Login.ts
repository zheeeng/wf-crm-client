const key1_ = 'authKey'
const key2_ = 'rememberMe'

function getCookieKey (key: string) {
  const cookiePair = document.cookie.split(';').map(item => item.split('=')).find(pair => pair[0].includes(key))

  return cookiePair !== undefined ? cookiePair[0] : ''
}

export function detect () {
  return getCookieKey(key1_) !== ''
}

export function clean () {
  const cookieKey1 = getCookieKey(key1_)
  const cookieKey2 = getCookieKey(key2_)

  if (cookieKey1 !== '') {
    document.cookie = cookieKey1 + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  if (cookieKey2 !== '') {
    document.cookie = cookieKey2 + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}
