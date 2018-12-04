import * as React from 'react'
import * as ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'
import registerServiceWorker from '~src/registerServiceWorker'

import appStore from '~src/services/app'
import notificationStore from '~src/services/notification'
import Notification from '~src/components/Notification'
import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import GlobalThemeProvider from '~src/theme/GlobalThemeProvider'

const $mountEl = document.querySelector('#content')

if ($mountEl) {
  const App = () => (
    <GlobalThemeProvider>
      <CssBaseline />
      <InjectIntoGlobalStyles />
      <appStore.Provider>
      <notificationStore.Provider>
        <Notification />
        <Roundation />
      </notificationStore.Provider>
      </appStore.Provider>
    </GlobalThemeProvider>
  )

  ReactDOM.render(App(), document.querySelector('#content'))
}

registerServiceWorker()
