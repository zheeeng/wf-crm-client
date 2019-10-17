import { useCallback, useEffect } from 'react'
import { cleanStorage, writeStorage, readStorage, deleteStorage, readStorageByPattern } from '~src/utils/storage'

export default function useLocalCache(namespace: string, maxAge: number) {
  useEffect(
    () => {
      cleanStorage(namespace)
      return () => cleanStorage(namespace)
    },
    []
  )

  const write = useCallback(
    (key: string, value: string) => {
      const now = +new Date()
      writeStorage(namespace, key, value, now + maxAge)
    },
    [namespace, maxAge],
  )

  const read = useCallback(
    (key: string) => readStorage(namespace, key),
    [namespace],
  )

  const remove = useCallback(
    (key: string) => deleteStorage(namespace, key),
    [namespace],
  )

  const rereadByPattern = useCallback(
    (pattern: RegExp) => readStorageByPattern(namespace, pattern),
    [namespace],
  )

  return { write, read, remove, rereadByPattern }
}
