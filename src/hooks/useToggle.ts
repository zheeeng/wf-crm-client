import { useState, useCallback } from 'react'

export default function useToggle (initial: boolean) {
  const [value, updateValue] = useState(initial)
  const toggle = useCallback(() => updateValue(prev => !prev), [])
  const toggleOn = useCallback(() => updateValue(true), [])
  const toggleOff = useCallback(() => updateValue(false), [])

  return {
    value, toggle, toggleOn, toggleOff,
  }
}
