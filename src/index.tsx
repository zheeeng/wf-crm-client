import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'
import registerServiceWorker from '~src/registerServiceWorker'

import Notification from '~src/components/Notification'
import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import GlobalThemeProvider from '~src/theme/GlobalThemeProvider'
import useSideDrawer from '~src/containers/useSideDrawer'

import useNotification from '~src/containers/useNotification'
import useAlert from '~src/containers/useAlert'
import useAccount from '~src/containers/useAccount'

import { exchangeAPIKey } from '~src/utils/qs3Login'

const isDev = process.env.NODE_ENV === 'development'

async function main () {
  if (isDev && document.location.pathname === '/') {
    document.location.pathname = '/crm'
  }

  try {
    if (!isDev) await exchangeAPIKey()
  } catch {
    if (document.location.pathname !== '/auth/signin') {
      document.location.pathname = '/auth/signin'
    }
    return
  }

  const $mountEl = document.querySelector('#content')

  if ($mountEl) {
    const App = () => (
      <GlobalThemeProvider>
        <CssBaseline />
        <InjectIntoGlobalStyles />
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
      </GlobalThemeProvider>
    )

    ReactDOM.render(App(), document.querySelector('#content'))
  }
}

main()

registerServiceWorker()
