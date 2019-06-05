import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { themeOptions } from './GlobalThemeProvider'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { overrides: _, ...restoreThemeOptions } = themeOptions

export const restoreTheme = createMuiTheme({
  ...restoreThemeOptions,
  overrides: {
    MuiIconButton: {
      root: {
        '&&:hover': {
          backgroundColor: '#f2f4f7',
        },
        '&&:active': {
          backgroundColor: '#ebedf5',
        },
      },
    },
  },
})

const RestoreThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={restoreTheme}>
    {props.children}
  </ThemeProvider>
)

export default RestoreThemeProvider
