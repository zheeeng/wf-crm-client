import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'
import registerServiceWorker from '~src/registerServiceWorker'

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
    <CssBaseline>
      <MuiThemeProvider theme={theme}>
        <notificationStore.Provider>
          <Notification />
          <Roundation />
        </notificationStore.Provider>
      </MuiThemeProvider>
    </CssBaseline>,
    document.querySelector('#content'),
  )
}

registerServiceWorker()
