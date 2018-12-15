import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { globalTheme, themeOptions } from './GlobalThemeProvider'
import mergeOptions from '~src/utils/mergeOptions'

export const siderBarTheme = createMuiTheme(mergeOptions(themeOptions, {
  overrides: {
    MuiListItemIcon: {
      root: {
        color: globalTheme.palette.primary.main,
        marginRight: 0,
      },
    },
    MuiListItemText: {
      primary: {
        color: globalTheme.palette.primary.main,
      },
    },
    MuiListItemSecondaryAction: {
      root: {
        color: globalTheme.palette.primary.main,
        paddingRight: globalTheme.spacing.unit * 2,
      },
    },
    MuiDivider: {
      root: {
        marginRight: globalTheme.spacing.unit * 3,
        marginLeft: globalTheme.spacing.unit * 3,
        height: 2,
        borderRadius: 1,
        backgroundColor: globalTheme.palette.primary.main,
      },
    },
  },
}))

const SiderBarThemeProvider: React.FC = (props) => (
  <MuiThemeProvider theme={siderBarTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default SiderBarThemeProvider
