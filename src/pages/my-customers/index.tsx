import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = (theme: Theme) => createStyles({
})

export interface Props extends WithStyles<typeof styles> {
}

export interface State {
}

class MyCustomersIndex extends React.Component<Props, State> {

  render () {
    return (
      null
    )
  }
}

export default withStyles(styles)(MyCustomersIndex)
