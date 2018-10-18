import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

export const globalTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#5d8df8',
    },
    background: {
      paper: '#fff',
      default: '#f2f4f7',
    },
    error: {
      main: '#e53214',
    },
    action: {
      active: '#ebedf5',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      '"Open sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
    body1: {
      fontSize: 14,
      fontWeight: 400,
    },
    title: {
      fontSize: 20,
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 700,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 992,
      xl: 1200,
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
