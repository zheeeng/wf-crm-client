import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'

export const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#4173e3',
    },
    secondary: {
      main: '#b0bcde',
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
      700: '#d1d6de',
      800: '#3a5b8e',
      900: '#e8edf5',
      A100: '#e9edf4',
      A200: '#aeb9ce',
      A400: '#afb4bb',
      A700: '#979797',
    },
    // error: {
    //   main: '#e53214',
    // },
    // action: {
    //   active: '#ebedf5',
    // },
  },
  typography: {
    fontFamily: ['"Open sans"', 'sans-serif'].join(','),
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
      fontWeight: 600,
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
})

export const themeOptions: ThemeOptions = {
  ...defaultTheme,
  overrides: {
    MuiToolbar: {
      dense: {
        height: 56,
      },
    },
    MuiButton: {
      root: {
        borderRadius: defaultTheme.spacing(2),
        textTransform: 'initial',
        color: defaultTheme.palette.text.secondary,
        '&&:hover': {
          backgroundColor: '#f2f4f7',
        },
        '&&:active': {
          backgroundColor: '#ebedf5',
        },
      },
      textPrimary: {
        fontWeight: 600,
      },
      outlinedPrimary: {
        '&&&': {
          color: 'white',
          borderColor: defaultTheme.palette.primary.main,
          backgroundColor: defaultTheme.palette.primary.main,
        },
        '&&:hover': {
          backgroundColor: '#5587f3',
        },
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderRadius: defaultTheme.spacing(2),
      },
    },
    MuiIconButton: {
      root: {
        '&&': {
          backgroundColor: 'unset',
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 12,
        color: 'white',
        backgroundColor: 'black',
      },
    },
  },
}

export const globalTheme = createMuiTheme(themeOptions)

const GlobalThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={globalTheme}>{props.children}</ThemeProvider>
)

export default GlobalThemeProvider
