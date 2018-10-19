import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

export const defaultTheme = createMuiTheme({})

export const globalTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#5d8df8',
    },
    text: {
      primary: '#3a5b8e',
      secondary: '#637694',
      disabled: '#8693a7',
      hint: '#afbebb',
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
  overrides: {
    MuiButton: {
      root: {
        borderRadius: defaultTheme.spacing.unit * 2,
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderRadius: defaultTheme.spacing.unit * 2,
      },
    },
  },
})

const GlobalThemeProvider: React.SFC = (props) => (
  <MuiThemeProvider theme={globalTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default GlobalThemeProvider
