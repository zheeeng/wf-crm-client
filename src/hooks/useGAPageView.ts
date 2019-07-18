import { useEffect } from 'react'

/*global ga*/

const useGAPageView = (reducer: (p: string) => string, pathName: string) => {
  const gaPath = reducer(pathName)
  useEffect(() => {
    if (typeof ga === 'undefined') return

    ga('set', 'page', gaPath)
    ga('send', 'pageview')

  }, [gaPath])
}

export default useGAPageView
