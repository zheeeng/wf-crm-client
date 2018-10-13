import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'
import registerServiceWorker from '~src/registerServiceWorker'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5d8df8',
    },
  },
})

ReactDOM.render(
  <CssBaseline>
    <MuiThemeProvider theme={theme}>
      <Roundation />
    </MuiThemeProvider>
  </CssBaseline>,
  document.querySelector('#content') as HTMLElement,
)
registerServiceWorker()
