import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const Colors = {
  blue: '#5d8df8',
}

const globalTheme = createMuiTheme({
  palette: {
    primary: {
      main: Colors.blue,
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

const siderBarTheme = createMuiTheme({
  overrides: {
    MuiListItemIcon: {
      root: {
        color: Colors.blue,
        marginRight: 0,
      },
    },
    MuiListItemText: {
      primary: {
        color: Colors.blue,
      },
    },
  },
})

export const SiderBarThemeProvider: React.SFC = (props) => (
  <MuiThemeProvider theme={siderBarTheme}>
    {props.children}
  </MuiThemeProvider>
)
