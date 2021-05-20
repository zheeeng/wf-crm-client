import { useEffect, useMemo, useRef } from 'react'

type DependencyList = any[]

const useSwitch = <F extends (...args: any) => unknown>(
  f: F,
  deps: DependencyList = [],
): F => {
  const ref = useRef<F | null>(f)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const f1 = useMemo(() => f as any, deps)
  const callback = useMemo(
    () =>
      (...args: any[]) =>
        new Promise((resolve, reject) => {
          if (ref.current !== f1) return
          f1(...args).then(
            (result: any) => {
              if (ref.current === f1) resolve(result)
            },
            (error: any) => {
              if (ref.current === f1) reject(error)
            },
          )
        }),
    [f1],
  )

  useEffect(() => {
    ref.current = f1
    return () => {
      ref.current = null
    }
  }, [f1])

  return callback as any
}

export default useSwitch
