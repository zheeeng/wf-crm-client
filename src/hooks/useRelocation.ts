import { useEffect } from 'react'

const useRelocation = (location: string) => {
  useEffect(() => {
    if (location) document.location.pathname = location
  }, [location])
}

export default useRelocation
