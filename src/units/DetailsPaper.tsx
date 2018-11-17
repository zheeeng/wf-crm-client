import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'

const styles = (theme: Theme) => createStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing.unit * 4,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
  leftSider: {
    flexGrow: 1,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
    marginRight: theme.spacing.unit * 4,
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  rightSider: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightPart1: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing.unit * 4,
    overflow: 'auto',
    width: 408,
    maxHeight: '50%',
  },
  rightPart2: {
    flexGrow: 1,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    width: 408,
    maxHeight: '50%',
  },
})

export interface Props extends WithStyles<typeof styles> {
  header: React.ReactNode
  children: React.ReactNode
  rightPart1: React.ReactNode
  rightPart2: React.ReactNode
}

const DetailsWrapper: React.FC<Props> = (props) => (
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
