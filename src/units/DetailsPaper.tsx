import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
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
}))

export interface Props {
  header: React.ReactNode
  children: React.ReactNode
  rightPart1: React.ReactNode
  rightPart2: React.ReactNode
}

const DetailsWrapper: React.FC<Props> = ({ header, children, rightPart1, rightPart2 }) => {
  const classes = useStyles({})

  return (
    <main className={classes.main}>
      <header className={classes.header}>
        {header}
      </header>
      <div className={classes.content}>
        <section className={classes.leftSider}>
          {children}
        </section>
        <aside className={classes.rightSider}>
          <section className={classes.rightPart1}>
            {rightPart1}
          </section>
          <section className={classes.rightPart2}>
            {rightPart2}
          </section>
        </aside>
      </div>
    </main>
  )
}

export default DetailsWrapper
