import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import { ComponentProps } from '@roundation/roundation/lib/types'

import * as vars from '~src/theme/vars'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    marginLeft: vars.SiderBarWidth,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    paddingBottom: 0,
    minWidth: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}))


import ContactsCountContainer from '~src/containers/ContactsCount'
import GroupsContainer from '~src/containers/Groups'
export interface Props extends
  ComponentProps<'aside' | 'header'> {
}

const CRMLayout: React.FC<Props> = ({ slots, children }) => {
  const classes = useStyles({})

  return (
    <ContactsCountContainer.Provider>
      <GroupsContainer.Provider>
      <div className={classes.root}>
        {slots.header}
        <div className={classes.main}>
          <Toolbar variant="dense" />
          {slots.aside}
          {children}
        </div>
      </div>
      </GroupsContainer.Provider>
    </ContactsCountContainer.Provider>
  )
}

export default CRMLayout
