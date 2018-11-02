import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = (theme: Theme) => createStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit * 4,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 0 5px 1px lightgrey',
    flexGrow: 1,
  },
})

export interface Props extends WithStyles<typeof styles> {
  children: React.ReactNode
}

const DisplayWrapper: React.SFC<Props> = (props) => (
  <main className={props.classes.main}>
    {props.children}
  </main>
)

export default withStyles(styles)(DisplayWrapper)
