import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'

export default withStyles(createStyles({
  '@global': {
    'div[role="group"][tabindex]': {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
  },
}))((() => null) as React.FC)
