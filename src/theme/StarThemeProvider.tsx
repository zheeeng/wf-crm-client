import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { globalTheme, themeOptions as gThemeOptions } from './GlobalThemeProvider'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import mergeOptions from '~src/utils/mergeOptions'

export const themeOptions: ThemeOptions = createMuiTheme(mergeOptions(gThemeOptions, {
  palette: {
    primary: {
      main: '#aeb9ce',
    },
  },
  overrides: {
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
    MuiTypography: {
      body2: {
        color: globalTheme.palette.text.secondary,
        fontSize: 16,
        fontWeight: 400,
      },
    },
    MuiTableCell: {
      root: {
        padding: 10,
      },
      body: {
        color: globalTheme.palette.text.secondary,
        fontSize: 16,
        fontWeight: 400,
      },
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: 'unset',
        },
      },
    },
  },
}))

export const starTheme = createMuiTheme(themeOptions)

const starThemeProvider: React.FC = (props) => (
  <MuiThemeProvider theme={starTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default starThemeProvider
