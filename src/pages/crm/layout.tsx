import React, { useContext } from 'react'
import { ComponentProps } from '@roundation/roundation'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import cssTips from '~src/utils/cssTips'
import AccountContainer from '~src/containers/Account'
import ProgressLoading from '~src/units/ProgressLoading'

import * as vars from '~src/theme/vars'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    ...cssTips(theme).casFlex(),
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  main: {
    ...cssTips(theme).casFlex(),
    marginLeft: vars.SiderBarWidth,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    minWidth: 0,
    height: '100vh',
  },
  loadingContainer: {
    ...cssTips(theme).centerFlex(),
    width: '100%',
    height: '100%',
  },
  progress: {
    width: `${theme.spacing(8)}px`,
    height: `${theme.spacing(8)}px`,
  },
}))


import ContactsCountContainer from '~src/containers/ContactsCount'
import GroupsContainer from '~src/containers/Groups'

export interface Props extends ComponentProps<'aside' | 'header'> {
}

const CRMLayout: React.FC<Props> = ({ slots, children }) => {
  const classes = useStyles({})
  const { authored } = useContext(AccountContainer.Context)

  return (
    <ContactsCountContainer.Provider>
      <GroupsContainer.Provider>
        <div className={classes.root}>
          {slots.header}
          <div className={classes.main}>
            <Toolbar variant="dense" />
            {slots.aside}
            {authored
              ? children
              : (
                <div className={classes.loadingContainer}>
                  <ProgressLoading className={classes.progress} />
                </div>
              )
            }
          </div>
        </div>
      </GroupsContainer.Provider>
    </ContactsCountContainer.Provider>
  )
}

export default CRMLayout
