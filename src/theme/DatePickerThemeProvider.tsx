import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { themeOptions } from './GlobalThemeProvider'
import mergeOptions from '~src/utils/mergeOptions'

export const datePickerTheme = createMuiTheme(mergeOptions(themeOptions, {
  overrides: {
    MuiIconButton: {
      root: {
        '&&': {
          backgroundColor: 'restore-unset',
        },
      },
    },
  },
}))

const DatePickerThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={datePickerTheme}>
    {props.children}
  </ThemeProvider>
)

export default DatePickerThemeProvider
