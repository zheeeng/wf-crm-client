import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { themeOptions } from './GlobalThemeProvider'
import mergeOptions from '~src/utils/mergeOptions'
import { MuiPickersOverrides } from 'material-ui-pickers/typings/overrides'

const getPickerOverrides = (): MuiPickersOverrides => ({
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: 'unset',
    },
  },
})

export const datePickerTheme = createMuiTheme(mergeOptions(themeOptions, {
  overrides: {
    MuiIconButton: {
      root: {
        '&&': {
          backgroundColor: 'restore-unset',
        },
      },
    },
    MuiButton: {
      root: {
        '&&:hover': {
          // backgroundColor: 'unset',
        },
        '&&:active': {
          backgroundColor: 'unset',
        },
      },
    },
    ...getPickerOverrides() as any,
  },
}))

const DatePickerThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={datePickerTheme}>
    {props.children}
  </ThemeProvider>
)

export default DatePickerThemeProvider
