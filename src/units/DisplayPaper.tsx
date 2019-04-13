import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 0px 8px 0px rgba(127, 136, 158, 0.1)',
    flex: 1,
  },
}))

export interface Props {
  children: React.ReactNode
}

const DisplayWrapper: React.FC<Props> = ({ children }) => {
  const classes = useStyles({})

  return (
    <main className={classes.main}>
      {children}
    </main>
  )
}

export default DisplayWrapper
