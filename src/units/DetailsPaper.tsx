import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = (theme: Theme) => createStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit * 4,
    flexGrow: 1,
  },
  header: {
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing.unit * 4,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit * 4,
    boxShadow: '0 0 5px 1px lightgrey',
    flexGrow: 1,
  },
  leftSider: {
    marginRight: theme.spacing.unit * 4,
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
  },
  rightSider: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 5px 1px lightgrey',
    flexGrow: 1,
  },
  rightPart1: {
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing.unit * 4,
  },
  rightPart2: {
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
  },
})

export interface Props extends WithStyles<typeof styles> {
  header: React.ReactNode
  children: React.ReactNode
  rightPart1: React.ReactNode
  rightPart2: React.ReactNode
}

const DetailsWrapper: React.SFC<Props> = (props) => (
  <main className={props.classes.main}>
    <header className={props.classes.header}>
      {props.header}
    </header>
    <div className={props.classes.content}>
      <section className={props.classes.leftSider}>
        {props.children}
      </section>
      <aside className={props.classes.rightSider}>
        <section className={props.classes.rightPart1}>
          {props.rightPart1}
        </section>
        <section className={props.classes.rightPart2}>
          {props.rightPart2}
        </section>
      </aside>
    </div>
  </main>
)

export default withStyles(styles)(DetailsWrapper)
