import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { globalTheme, themeOptions } from './GlobalThemeProvider'
import mergeOptions from '~src/utils/mergeOptions'

export const createFormTheme = createMuiTheme(mergeOptions(themeOptions, {
  overrides: {
    MuiMenu: {
      paper: {
        maxHeight: globalTheme.spacing.unit * 24,
        marginTop: globalTheme.spacing.unit * 6,
        marginLeft: -globalTheme.spacing.unit,
        color: globalTheme.palette.text.secondary,
      },
    },
    MuiMenuItem: {
      root: {
        color: globalTheme.palette.text.secondary,
        fontSize: 12,
      }
    },
  },
}))

const createFormThemeProvider: React.FC = (props) => (
  <MuiThemeProvider theme={createFormTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default createFormThemeProvider
