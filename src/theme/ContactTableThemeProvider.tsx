import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { globalTheme, themeOptions } from './GlobalThemeProvider'
import mergeOptions from '~src/utils/mergeOptions'

export const contactTableTheme = createMuiTheme(mergeOptions(themeOptions, {
  overrides: {
    MuiAvatar: {
      root: {
        width: 48,
        height: 48,
        padding: 12,
      },
    },
    MuiTableCell: {
      root: {
        padding: 12,
        verticalAlign: 'middle',
      },
    },
    MuiTableRow: {
      root: {
        [globalTheme.breakpoints.down('sm')]: {
          verticalAlign: 'top',
        },
      },
    },
    MuiTabs: {
      root: {
        marginRight: globalTheme.spacing(2),
      },
      indicator: {
        transform: 'scale(0.5)',
        transformOrigin: '45%',
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        padding: 0,
        ...{
          '&&': {
            minWidth: 'unset',
          },
        },
      },
    },
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
    MuiStepper: {
      root: {
        padding: 0,
      },
    },
    MuiStepContent: {
      root: {
        position: 'relative',
        paddingTop: globalTheme.spacing(1),
        paddingLeft: globalTheme.spacing(6),
        fontSize: '0.75rem',
        color: globalTheme.palette.grey[800],
        borderLeftWidth: 2,
        borderLeftColor: globalTheme.palette.primary.light,
        marginLeft: 11,
        ...{
          '&:before': {
            content: '""',
            position: 'absolute',
            left: -2,
            top: -12,
            height: 12,
            borderLeftWidth: 2,
            borderLeftColor: globalTheme.palette.primary.light,
            borderLeftStyle: 'solid',
          },
        },
      },
      last: {
        '&:before': {
          content: 'none',
        },
      },
    },
    MuiStepConnector: {
      root: {
        flex:0,
        position: 'relative',
        padding: 0,
        height: 0,
      },
      lineVertical: {
        ...{
          '&:after': {
            content: '""',
            position: 'absolute',
            left: -1,
            bottom: -4,
            height: 12,
            borderLeftWidth: 2,
            borderLeftColor: globalTheme.palette.primary.light,
            borderLeftStyle: 'solid',
          },
          '&&': {
            borderLeftWidth: 2,
            borderLeftColor: globalTheme.palette.primary.light,
            marginLeft: -1,
          },
        },
      },
    },
    MuiStepLabel: {
      active: {
        ...{
          '&&': {
            color: globalTheme.palette.grey[800],
          },
        },
      },
    },
  },
}))

const ContactTableThemeProvider: React.FC = (props) => (
  <ThemeProvider theme={contactTableTheme}>
    {props.children}
  </ThemeProvider>
)

export default ContactTableThemeProvider
