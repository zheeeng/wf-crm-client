import { useState, useCallback } from 'react'
import useFetch from './useFetch'

const useRequest = <T = any>(method?: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
  const fetch = useFetch()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)

  const request = useCallback(
    (url: string) => async (params?: object): Promise<T | null> => {
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
    [setData, setIsLoading, setError],
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
