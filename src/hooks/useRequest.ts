import { useState, useCallback } from 'react'
import { useBoolean } from 'react-hanger'
import useFetch from './useFetch'

const useRequest = <T = any>(method?: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
  const fetch = useFetch()
  const { value: isLoading, setValue: setIsLoading } = useBoolean(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)

  const request = useCallback(
    (url: string) =>
      async (params?: Record<string, unknown>): Promise<T | null> => {
        try {
          setIsLoading(true)
          const response = await fetch<T>(url, { method, params })
          setData(response)

          return response
        } catch (err) {
          setError(err)

          return null
        } finally {
          setIsLoading(false)
        }
      },
    [method, setData, fetch, setIsLoading, setError],
  )

  return {
    data,
    error,
    isLoading,
    request,
  }
}

export const useGet = <T = any>() => useRequest<T>('GET')
export const usePost = <T = any>() => useRequest<T>('POST')
export const usePut = <T = any>() => useRequest<T>('PUT')
export const useDelete = <T = any>() => useRequest<T>('DELETE')

export default useRequest
