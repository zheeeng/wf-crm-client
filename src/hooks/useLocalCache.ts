import { useCallback, useEffect } from 'react'
import { cleanStorage, writeStorage, readStorage } from '~src/utils/storage'

export enum TimeUnit {
  Ms = 1,
  Second = TimeUnit.Second * 1000,
  Minute = TimeUnit.Second * 60,
  Hour = TimeUnit.Minute * 60,
  Day = TimeUnit.Hour * 24,
  Week = TimeUnit.Day * 7,
}

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
    [],
  )

  const read = useCallback(
    (key: string) => {
      return readStorage(namespace, key)
    },
    [],
  )

  return { write, read }
}
