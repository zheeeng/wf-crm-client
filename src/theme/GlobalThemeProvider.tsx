import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'

export const defaultTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#4173e3',
    },
    text: {
      primary: '#5d8df8',
      secondary: '#637694',
      disabled: '#8693a7',
      hint: '#afbebb',
    },
    background: {
      paper: '#fff',
      default: '#f2f4f7',
    },
    grey: {
      A100: '#e9edf4',
      A200: '#aeb9ce',
    },
    // error: {
    //   main: '#e53214',
    // },
    // action: {
    //   active: '#ebedf5',
    // },
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      '"Open sans"',
      '"Helvetica Neue"',
      'sans-serif',
    ].join(','),
    h4: {
      fontSize: 20,
      fontWeight: 600,
    },
    h5: {
      fontSize: 18,
      fontWeight: 700,
    },
    h6: {
      fontSize: 16,
      fontWeight: 700,
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
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
    MuiToolbar: {
      dense: {
         height: 56,
      },
    },
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
}

export const globalTheme = createMuiTheme(themeOptions)

const GlobalThemeProvider: React.FC = (props) => (
  <MuiThemeProvider theme={globalTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default GlobalThemeProvider
