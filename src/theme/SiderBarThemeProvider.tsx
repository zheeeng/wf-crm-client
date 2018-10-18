import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { globalTheme } from './GlobalThemeProvider'

export const siderBarTheme = createMuiTheme({
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
})

const SiderBarThemeProvider: React.SFC = (props) => (
  <MuiThemeProvider theme={siderBarTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default SiderBarThemeProvider
