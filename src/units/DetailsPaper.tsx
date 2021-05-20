import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import cssTips from '~src/utils/cssTips'

const useStyles = makeStyles((theme: Theme) => ({
  fullWidth: {
    width: '100%',
  },
  main: {
    ...cssTips(theme).casFlex(),
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: '0px 0px 8px 0px rgba(127, 136, 158, 0.1)',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(4),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2.5)}px`,
  },
  content: {
    ...cssTips(theme).casFlex('row'),
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      overflow: 'auto',
    },
  },
  footerPlacer: {
    // marginBottom: theme.spacing(4),
  },
  leftSider: {
    ...cssTips(theme).casFlex(),
    height: '100%',
    padding: theme.spacing(2),
    marginRight: theme.spacing(4),
    boxShadow: '0px 0px 8px 0px rgba(127, 136, 158, 0.1)',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
      flex: 'unset',
      height: 'unset',
      marginRight: 0,
      marginBottom: theme.spacing(4),
    },
  },
  rightSider: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightPart1: {
    ...cssTips(theme).casFlex(),
    flexBasis: '50%',
    padding: `${theme.spacing(2)}px 0`,
    boxShadow: '0px 0px 8px 0px rgba(127, 136, 158, 0.1)',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(4),
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
    ...cssTips(theme).casFlex(),
    flexBasis: '50%',
    padding: `${theme.spacing(2)}px 0`,
    boxShadow: '0px 0px 8px 0px rgba(127, 136, 158, 0.1)',
    backgroundColor: theme.palette.background.paper,
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
        <header className={classes.header}>{renderHeader()}</header>
        <div className={classes.content}>
          <section className={classes.leftSider}>{children}</section>
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

export interface EmptyDetailsPaperProps {
  renderHeader: () => React.ReactNode
  children: React.ReactNode
}

export const EmptyDetailsPaper: React.FC<EmptyDetailsPaperProps> = React.memo(
  ({ renderHeader, children }) => {
    const classes = useStyles({})

    return (
      <main className={classes.main}>
        <header className={classes.header}>{renderHeader()}</header>
        <div className={classes.content}>
          <div className={classes.fullWidth}>{children}</div>
        </div>
        <div className={classes.footerPlacer} />
      </main>
    )
  },
)

export default DetailsPaper
