import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'
import registerServiceWorker from '~src/registerServiceWorker'

import Notification from '~src/components/Notification'
import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import GlobalThemeProvider from '~src/theme/GlobalThemeProvider'
import AppContainer from '~src/containers/App'
import NotificationContainer from '~src/containers/Notification'
import AlertContainer from '~src/containers/Alert'
import AccountContainer from '~src/containers/Account'
import { detect } from '~src/utils/qs3Login'

if (!detect()) {
  if (document.location.pathname !== '/auth/signin') {
    document.location.pathname = '/auth/signin'
  }
} else {
  const $mountEl = document.querySelector('#content')

  if ($mountEl) {
    const App = () => (
      <GlobalThemeProvider>
        <CssBaseline />
        <InjectIntoGlobalStyles />
        <AppContainer.Provider>
        <AccountContainer.Provider>
        <NotificationContainer.Provider>
        <AlertContainer.Provider>
          <Notification />
          <Roundation />
        </AlertContainer.Provider>
        </NotificationContainer.Provider>
        </AccountContainer.Provider>
        </AppContainer.Provider>
      </GlobalThemeProvider>
    )

    ReactDOM.render(App(), document.querySelector('#content'))
  }

  registerServiceWorker()
}
