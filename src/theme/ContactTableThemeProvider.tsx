import * as React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { globalTheme } from './GlobalThemeProvider'

export const contactTableTheme = createMuiTheme({
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
        paddingTop: 12,
        paddingBottom: 12,
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
})

const ContactTableThemeProvider: React.SFC = (props) => (
  <MuiThemeProvider theme={contactTableTheme}>
    {props.children}
  </MuiThemeProvider>
)

export default ContactTableThemeProvider
