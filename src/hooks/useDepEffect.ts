import { useEffect } from 'react'

export default function useDepEffect (
  f: (inputs: ReadonlyArray<any>) => (void | (() => void)),
  inputs?: ReadonlyArray<any>,
) {
  return useEffect(() => f(inputs || []), inputs)
}
