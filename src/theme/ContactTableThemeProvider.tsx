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
  },
}))

const ContactTableThemeProvider: React.SFC = (props) => (
  <MuiThemeProvider theme={contactTableTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default ContactTableThemeProvider