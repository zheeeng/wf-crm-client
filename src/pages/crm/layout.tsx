import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import Toolbar from '@material-ui/core/Toolbar'
import ProgressLoading from '~src/units/ProgressLoading'

import useAccount from '~src/containers/useAccount'
import useContactsCount from '~src/containers/useContactsCount'
import useGroups from '~src/containers/useGroups'
import useStyles from '~src/styles/useLayoutStyles'

export interface Props extends ComponentProps<'aside' | 'header'> {
}

const CRMLayout: React.FC<Props> = ({ slots, children }) => {
  const classes = useStyles({})
  const { authored } = useAccount()

  return (
    <useContactsCount.Provider>
      <useGroups.Provider groupId={''}>
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
      </useGroups.Provider>
    </useContactsCount.Provider>
  )
}

export default CRMLayout
