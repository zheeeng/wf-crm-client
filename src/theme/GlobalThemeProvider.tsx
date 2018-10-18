import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

export const globalTheme = createMuiTheme({
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

const GlobalThemeProvider: React.SFC = (props) => (
  <MuiThemeProvider theme={globalTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default GlobalThemeProvider
