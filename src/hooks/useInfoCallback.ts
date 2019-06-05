import { useState, useCallback } from 'react'

export default function useInfoCallback <T extends (...args: any[]) => any> (
  callback: T, inputs: any[],
): [T, number] {
  const [mutation, notify] = useState(0)

  const innerCallback = useCallback(
    async (...args: any[]) => {
      const ret = await callback(...args)
      notify(m => m + 1)

      return ret
    },
    inputs,
  )

  return [innerCallback as any, mutation]
}
