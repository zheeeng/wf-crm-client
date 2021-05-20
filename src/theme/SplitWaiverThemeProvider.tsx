import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { themeOptions } from './GlobalThemeProvider'
import mergeOptions from '~src/utils/mergeOptions'

export const splitWaiverTheme = createMuiTheme(
  mergeOptions(themeOptions, {
    overrides: {},
  }),
)

const SplitWaiverThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={splitWaiverTheme}>{props.children}</ThemeProvider>
)

export default SplitWaiverThemeProvider
