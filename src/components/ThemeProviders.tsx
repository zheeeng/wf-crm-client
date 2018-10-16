import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const globalTheme = createMuiTheme({
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

export const GlobalThemeProvider: React.SFC = (props) => (
  <MuiThemeProvider theme={globalTheme}>
    {props.children}
  </MuiThemeProvider>
)
