import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { globalTheme, themeOptions } from './GlobalThemeProvider'
import mergeOptions from '~src/utils/mergeOptions'

export const siderBarTheme = createMuiTheme(
  mergeOptions(themeOptions, {
    overrides: {
      MuiList: {
        root: {
          color: globalTheme.palette.text.primary,
        },
      },
      MuiListItem: {
        gutters: {
          paddingTop: 18,
          paddingRight: 32,
          paddingBottom: 18,
          paddingLeft: 28,
        },
        button: {
          color: globalTheme.palette.text.secondary,
          '&.active': {
            color: globalTheme.palette.text.primary,
          },
          '&:hover': {
            color: globalTheme.palette.text.primary,
            backgroundColor: globalTheme.palette.grey.A100,
          },
        },
      },
      MuiListItemIcon: {
        root: {
          color: globalTheme.palette.text.primary,
          marginRight: 0,
        },
      },
      MuiListItemText: {
        primary: {
          color: 'inherit',
          fontSize: 16,
          fontWeight: 600,
          textAlign: 'left',
        },
      },
      MuiListItemSecondaryAction: {
        root: {
          color: globalTheme.palette.primary.main,
          paddingRight: globalTheme.spacing(2),
        },
      },
      MuiDivider: {
        root: {
          marginRight: globalTheme.spacing(3),
          marginLeft: globalTheme.spacing(3),
          height: 2,
          borderRadius: 1,
          backgroundColor: globalTheme.palette.primary.main,
          marginBottom: 20,
        },
      },
    },
  }),
)

const SiderBarThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={siderBarTheme}>{props.children}</ThemeProvider>
)

export default SiderBarThemeProvider
