import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { globalTheme, themeOptions } from './GlobalThemeProvider'
import mergeOptions from '~src/utils/mergeOptions'

export const splitWaiverTheme = createMuiTheme(mergeOptions(themeOptions, {
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'initial',
        color: globalTheme.palette.text.secondary,
      },
      textPrimary: {
        fontWeight: 600,
      },
      outlinedPrimary: {
        fontWeight: 600,
        color: globalTheme.palette.text.primary,
      },
    },
  },
}))

const SplitWaiverThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={splitWaiverTheme}>
    {props.children}
  </ThemeProvider>
)

export default SplitWaiverThemeProvider
