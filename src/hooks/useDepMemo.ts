import { useMemo } from 'react'

export default function useDepMemo<T, A = unknown> (
  f: (inputs: A[]) => T,
  inputs: A[],
) {
  return useMemo<T>(() => f(inputs || []), inputs)
}
