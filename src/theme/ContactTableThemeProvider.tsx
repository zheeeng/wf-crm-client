import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
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
        marginRight: globalTheme.spacing.unit * 2,
      },
      indicator: {
        transform: 'scale(0.3)',
        transformOrigin: '15%',
      },
    },
    MuiTab: {
      root: {
        minWidth: '100px !important',
      },
      labelContainer: {
        textAlign: 'left',
        padding: '0 !important',
        textTransform: 'capitalize',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'capitalize',
      },
    },
    MuiStepper: {
      root: {
        padding: 0,
      },
    },
    MuiStepContent: {
      root: {
        paddingLeft: globalTheme.spacing.unit * 6,
        fontSize: '0.75rem',
      },
    },
    MuiStepConnector: {
      line: {
        borderLeftWidth: 3,
        marginLeft: -1,
      },
    },
  },
}))

const ContactTableThemeProvider: React.FC = (props) => (
  <MuiThemeProvider theme={contactTableTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default ContactTableThemeProvider
