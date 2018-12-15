import { useMemo } from 'react'

export default function useDepMemo<T, A = any> (
  f: (inputs: A[]) => T,
  inputs: A[],
) {
  return useMemo(() => f(inputs || []), inputs)
}
