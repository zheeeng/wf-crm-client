const privateNamespacePrefix = '__@@pnp@__'

const getNamespace = (namespace: string) => privateNamespacePrefix + namespace

function setItem(namespace: string, value: string) {
  window.localStorage.setItem(getNamespace(namespace), value)
}

function getItem(namespace: string) {
  return window.localStorage.getItem(getNamespace(namespace))
}

type CacheRecords = { [key: string]: [string, number] }

export function cleanStorage(namespace: string) {
  const now = +Date.now()
  const records: CacheRecords = JSON.parse(getItem(namespace) ?? '{}')
  for (const key in records)
    if (
      Object.prototype.hasOwnProperty.call(records, key) &&
      now >= records[key][1]
    )
      delete records[key]
}

export function writeStorage(
  namespace: string,
  key: string,
  value: string,
  exp: number,
) {
  const records: CacheRecords = JSON.parse(getItem(namespace) ?? '{}')
  records[key] = [value, exp]
  setItem(namespace, JSON.stringify(records))
}

export function readStorage(namespace: string, key: string): string | null {
  const pairs = getItem(namespace)
  if (!pairs) return null

  const records = (JSON.parse(pairs) as CacheRecords) ?? {}
  const record = records[key]
  if (!record) return null

  const [value, exp] = record
  if (+Date.now() >= exp) return null

  return value
}

export function deleteStorage(namespace: string, key: string) {
  const pairs = getItem(namespace)
  if (!pairs) return
  const records = (JSON.parse(pairs) as CacheRecords) ?? {}
  delete records[key]
}

export function readStorageByPattern(
  namespace: string,
  pattern: RegExp,
): { [key: string]: string } {
  const now = +Date.now()
  const pairs = getItem(namespace)
  if (!pairs) return {}
  const records = (JSON.parse(pairs) as CacheRecords) ?? {}
  const matched: { [key: string]: string } = {}
  for (const key in records)
    if (
      Object.prototype.hasOwnProperty.call(records, key) &&
      pattern.test(key)
    ) {
      const [value, expire] = records[key]
      if (now < expire) {
        matched[key] = value
      }
    }

  return matched
}
