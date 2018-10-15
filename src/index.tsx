import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme, withStyles, createStyles } from '@material-ui/core/styles'
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

const InjectIntoGlobalStyles = withStyles(createStyles({
  '@global': {
    'div[role="group"][tabindex]': {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
  },
}))((() => null) as React.SFC)

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
