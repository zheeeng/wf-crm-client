import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'

export const defaultTheme = createMuiTheme({})

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#5d8df8',
    },
    secondary: {
      main: '#ffc84a',
    },
  },
}

export const starTheme = createMuiTheme(themeOptions)

const starThemeProvider: React.FC = (props) => (
  <MuiThemeProvider theme={starTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default starThemeProvider
