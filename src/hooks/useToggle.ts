import { useState, useCallback } from 'react'

type UseAlternativeToggle = <T1, T2 = T1 >(initial: T1, alternative: T2) =>
{ value: T1 | T2, toggle: () => void, toggleOn: () => void, toggleOff: () => void }
type UseBooleanToggle = (initial?: boolean) =>
{ value: boolean, toggle: () => void, toggleOn: () => void, toggleOff: () => void }

interface UseToggle extends UseAlternativeToggle, UseBooleanToggle {
}

export const useAlternativeToggle: UseAlternativeToggle = <T1, T2 = T1>(initial: T1, alternative: T2) => {
  const [value, updateValue] = useState<T1 | T2>(initial)
  const toggle = useCallback(() => updateValue(prev => prev === initial ? alternative : initial), [])
  const toggleOn = useCallback(() => updateValue(alternative), [])
  const toggleOff = useCallback(() => updateValue(initial), [])

  return {
    value, toggle, toggleOn, toggleOff,
  }
}

const useBooleanToggle: UseBooleanToggle = (initial: boolean = false) => {
  const [value, updateValue] = useState(initial)
  const toggle = useCallback(() => updateValue(prev => !prev), [])
  const toggleOn = useCallback(() => updateValue(true), [])
  const toggleOff = useCallback(() => updateValue(false), [])

  return {
    value, toggle, toggleOn, toggleOff,
  }
}

function useToggle (initial: boolean = false) {

  return useBooleanToggle(initial)
}

export default useToggle as UseToggle
