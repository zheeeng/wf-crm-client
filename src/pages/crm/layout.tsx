import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import Toolbar from '@material-ui/core/Toolbar'
import ProgressLoading from '~src/units/ProgressLoading'

import { useAccount } from '~src/containers/useAccount'
import { UseContactsCountProvider } from '~src/containers/useContactsCount'
import { UseGroupsProvider } from '~src/containers/useGroups'
import useStyles from '~src/styles/useLayoutStyles'

export interface Props extends ComponentProps<'aside' | 'header'> {}

const CRMLayout: React.FC<Props> = ({ slots, children }) => {
  const classes = useStyles({})
  const { authored } = useAccount()

  return (
    <UseContactsCountProvider>
      <UseGroupsProvider groupId={''}>
        <div className={classes.root}>
          {slots.header}
          <div className={classes.main}>
            <Toolbar variant="dense" />
            {slots.aside}
            {authored ? (
              children
            ) : (
              <div className={classes.loadingContainer}>
                <ProgressLoading className={classes.progress} />
              </div>
            )}
          </div>
        </div>
      </UseGroupsProvider>
    </UseContactsCountProvider>
  )
}

export default CRMLayout
