import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { themeOptions } from './GlobalThemeProvider'

const { overrides, ...restoreThemeOptions } = themeOptions

export const restoreTheme = createMuiTheme(restoreThemeOptions)

const RestoreThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={restoreTheme}>
    {props.children}
  </ThemeProvider>
)

export default RestoreThemeProvider
