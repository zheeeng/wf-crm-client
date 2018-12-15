import { useState, useCallback } from 'react'
import fetch from '~src/utils/fetchData'

const useRequest = <T = any>(method?: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)

  const request = useCallback(
    (url: string) => async (params?: object) => {
      try {
        setIsLoading(true)
        const response = await fetch<T>(url, { method, params })
        setData(response)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    },
    [],
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
