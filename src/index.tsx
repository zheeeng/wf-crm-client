import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'
import registerServiceWorker from '~src/registerServiceWorker'

import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import notificationStore from '~src/services/notification'
import Notification from '~src/components/Notification'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5d8df8',
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
})

const $mountEl = document.querySelector('#content')

if ($mountEl) {
  ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <InjectIntoGlobalStyles />
      <notificationStore.Provider>
        <Notification />
        <Roundation />
      </notificationStore.Provider>
    </MuiThemeProvider>,
    document.querySelector('#content'),
  )
}

registerServiceWorker()
