import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(4),
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      overflow: 'auto',
    },
  },
  footerPlacer: {
    marginBottom: theme.spacing(4),
  },
  leftSider: {
    flex: 1,
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    marginRight: theme.spacing(4),
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginBottom: theme.spacing(4),
    },
  },
  rightSider: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightPart1: {
    padding: `${theme.spacing(2)}px 0`,
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(4),
    overflow: 'auto',
    width: 408,
    maxHeight: '50%',
    [theme.breakpoints.down('lg')]: {
      width: 320,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  rightPart2: {
    flex: 1,
    padding: `${theme.spacing(2)}px 0`,
    boxShadow: '0 0 5px 1px lightgrey',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    width: 408,
    [theme.breakpoints.down('lg')]: {
      width: 320,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}))

export interface Props {
  renderHeader: () => React.ReactNode
  children: React.ReactNode
  renderRightPart1: () => React.ReactNode
  renderRightPart2: () => React.ReactNode
}

const DetailsPaper: React.FC<Props> = React.memo(
  ({ renderHeader, children, renderRightPart1, renderRightPart2 }) => {
    const classes = useStyles({})

    return (
      <main className={classes.main}>
        <header className={classes.header}>
          {renderHeader()}
        </header>
        <div className={classes.content}>
          <section className={classes.leftSider}>
            {children}
          </section>
          <aside className={classes.rightSider}>
            <section className={classes.rightPart1}>
              {renderRightPart1()}
            </section>
            <section className={classes.rightPart2}>
              {renderRightPart2()}
            </section>
          </aside>
        </div>
        <div className={classes.footerPlacer} />
      </main>
    )
  },
)

export default DetailsPaper
