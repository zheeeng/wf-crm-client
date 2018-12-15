import { useRef } from 'react'

function pickLatest<T> (oldValues: T[], newValues: T[]) {
  return newValues.find((value, index) => value !== oldValues[index])
}

export default function useLatest<T> (...values: T[]) {
  const latestRef = useRef<T | undefined>(undefined)
  const previousRef = useRef(values)
  const latest = pickLatest(previousRef.current, values)
  if (latest) {
    latestRef.current = latest
    previousRef.current = values
  }

  return latestRef.current
}
