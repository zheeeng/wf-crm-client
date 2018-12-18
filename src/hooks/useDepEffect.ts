import { useEffect } from 'react'

export default function useDepEffect <A = unknown> (
  f: (inputs: A[]) => (void | (() => void)),
  inputs?: A[],
) {
  return useEffect(() => f(inputs || []), inputs)
}
