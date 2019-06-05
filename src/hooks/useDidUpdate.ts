import { useRef, useEffect } from 'react'

type DependencyList = any[]

type EffectCallback = () => (void | (() => void | undefined))

export default function useDidUpdate (effect: EffectCallback, deps?: DependencyList) {
  const isFirstRenderRef = useRef(true)

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
    } else {
      return effect()
    }
  }, deps)
}
