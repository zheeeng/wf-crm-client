import React, { useState, useCallback, useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'

import Notification from '~src/components/Notification'
import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import GlobalThemeProvider from '~src/theme/GlobalThemeProvider'
import useSideDrawer from '~src/containers/useSideDrawer'
import useNotification from '~src/containers/useNotification'
import useAlert from '~src/containers/useAlert'
import useAccount from '~src/containers/useAccount'
import SkeletonApp from '~src/SkeletonApp'
import useRelocation from '~src/hooks/useRelocation'
import { exchangeAPIKey } from '~src/utils/qs3Login'

const isPrerendering = navigator.userAgent === 'ReactSnap'

const Main: React.FC = () => (
  <useSideDrawer.Provider>
    <useAccount.Provider>
      <useNotification.Provider>
        <useAlert.Provider>
          <Notification />
          <Roundation />
        </useAlert.Provider>
      </useNotification.Provider>
    </useAccount.Provider>
  </useSideDrawer.Provider>
)

const App: React.FC<{ isDev: boolean }> = ({ isDev }) => {
  const [isLoading, setIsLoading] = useState(true)

  const [relocationURL, setRelocationURL] = useState('')

  useRelocation(relocationURL)

  const validate = useCallback(
    async () => {
      if (isDev && document.location.pathname === '/') {
        setRelocationURL('/crm')

        return
      }

      try {
        !isDev && await exchangeAPIKey()
      } catch {
        document.location.pathname !== '/auth/signin' && setRelocationURL('/auth/signin')
      }
      setIsLoading(false)
    },
    [isDev],
  )

  useEffect(() => { validate() }, [validate])

  return (
    <GlobalThemeProvider>
      <CssBaseline />
      <InjectIntoGlobalStyles />
      {(isPrerendering || isLoading) ? <SkeletonApp /> : <Main />}
    </GlobalThemeProvider>
  )
}

export default App
