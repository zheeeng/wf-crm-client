import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'
import registerServiceWorker from '~src/registerServiceWorker'

import notificationStore from '~src/services/notification'
import Notification from '~src/components/Notification'
import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import GlobalThemeProvider from '~src/theme/GlobalThemeProvider'
import AppContainer from '~src/containers/App'
import AccountContainer from '~src/containers/Account'

const $mountEl = document.querySelector('#content')

if ($mountEl) {
  const App = () => (
    <GlobalThemeProvider>
      <CssBaseline />
      <InjectIntoGlobalStyles />
      <AppContainer.Provider>
      <AccountContainer.Provider>
      <notificationStore.Provider>
        <Notification />
        <Roundation />
      </notificationStore.Provider>
      </AccountContainer.Provider>
      </AppContainer.Provider>
    </GlobalThemeProvider>
  )

  ReactDOM.render(App(), document.querySelector('#content'))
}

registerServiceWorker()
