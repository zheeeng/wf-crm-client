import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import { ComponentProps } from '@roundation/roundation/lib/types'
import appStore from '~src/services/app'

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
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
})

export interface Props extends WithStyles<typeof styles>, ComponentProps<'header'> {
}

const App: React.FC<Props> = React.memo(({ classes, slots, children }) => {
  const appContext = React.useContext(appStore.Context)
  React.useEffect(
    () => {
      appContext.auth()
    },
    [],
  )

  return (
    <div className={classes.root}>
      {slots.header}
      <div className={classes.main}>
        <Toolbar />
        {children}
      </div>
    </div>
  )
})

export default withStyles(styles)(App)
