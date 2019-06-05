import { useCallback, useEffect, useRef } from 'react'

type DependencyList = any[]

const useSwitch = <F extends Function>(f: F, deps: DependencyList = []): F => {
  const ref = useRef<F | null>(f)
  const f1 = useCallback(f as any, deps)
  const callback = useCallback(
    (...args: any[]) => new Promise(async (resolve, reject) => {
      if (ref.current !== f1) return
      try {
        const result = await f1(...args)
        if (ref.current === f1) resolve(result)
      } catch (error) {
        if (ref.current === f1) reject(error)
      }
    }),
    [f1],
  )

  useEffect(
    () => {
      ref.current = f1
      return () => { ref.current = null }
    },
    [f1]
  )

  return callback as any
}

export default useSwitch
