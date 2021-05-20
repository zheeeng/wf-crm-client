import React, { useState, useCallback, useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'

import Notification from '~src/components/Notification'
import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import GlobalThemeProvider from '~src/theme/GlobalThemeProvider'
import { UseSideDrawerProvider } from '~src/containers/useSideDrawer'
import { UseNotificationProvider } from '~src/containers/useNotification'
import { UseAlertProvider } from '~src/containers/useAlert'
import { UseAccountProvider } from '~src/containers/useAccount'
import SkeletonApp from '~src/SkeletonApp'
import useRelocation from '~src/hooks/useRelocation'
import { exchangeAPIKey } from '~src/utils/qs3Login'

const isPreRendering = navigator.userAgent === 'ReactSnap'

const Main: React.FC = () => (
  <UseSideDrawerProvider>
    <UseAccountProvider>
      <UseNotificationProvider>
        <UseAlertProvider>
          <Notification />
          <Roundation />
        </UseAlertProvider>
      </UseNotificationProvider>
    </UseAccountProvider>
  </UseSideDrawerProvider>
)

const App: React.FC<{ isDev: boolean }> = ({ isDev }) => {
  const [isLoading, setIsLoading] = useState(true)

  const [relocationURL, setRelocationURL] = useState('')

  useRelocation(relocationURL)

  const validate = useCallback(async () => {
    if (isDev && document.location.pathname === '/') {
      setRelocationURL('/crm')

      return
    }

    try {
      !isDev && (await exchangeAPIKey())
    } catch {
      document.location.pathname !== '/auth/signin' &&
        setRelocationURL('/auth/signin')
    }
    setIsLoading(false)
  }, [isDev])

  useEffect(() => {
    validate()
  }, [validate])

  return (
    <GlobalThemeProvider>
      <CssBaseline />
      <InjectIntoGlobalStyles />
      {isPreRendering || isLoading ? <SkeletonApp /> : <Main />}
    </GlobalThemeProvider>
  )
}

export default App
