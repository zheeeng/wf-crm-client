import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import { ComponentProps } from '@roundation/roundation/lib/types'

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  main: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit * 30,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0,
    // TODO:: Change to 100%
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit * 4,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 0 5px 1px lightgrey',
    flexGrow: 1,
  },
})

export interface Props extends WithStyles<typeof styles>, ComponentProps<'header'> {
}

class App extends React.Component<Props> {

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        {this.props.slots.header}
        <main className={classes.main}>
          <Toolbar />
          <div className={classes.content}>
            {this.props.children}
          </div>
        </main>
      </div>
    )
  }
}

export default withStyles(styles)(App)
