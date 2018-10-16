import * as React from 'react'
import * as ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'
import registerServiceWorker from '~src/registerServiceWorker'

import notificationStore from '~src/services/notification'
import Notification from '~src/components/Notification'
import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import { GlobalThemeProvider } from '~src/components/ThemeProviders'

const $mountEl = document.querySelector('#content')

if ($mountEl) {
  ReactDOM.render(
    <GlobalThemeProvider>
      <CssBaseline/>
      <InjectIntoGlobalStyles />
      <notificationStore.Provider>
        <Notification />
        <Roundation />
      </notificationStore.Provider>
    </GlobalThemeProvider>,
    document.querySelector('#content'),
  )
}

registerServiceWorker()
