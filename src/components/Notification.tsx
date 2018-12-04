import * as React from 'react'
import { WithContext } from '@roundation/store'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import store from '~src/services/notification'

export interface Props extends WithContext<typeof store, 'notificationStore'> {
}

const Notification: React.FC = () => {
  const notificationContext = React.useContext(store.Context)

  const handleClose = React.useCallback(
    (_: any, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }

      notificationContext.handleClose()
    },
    [notificationContext.handleClose],
  )

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={!!notificationContext.message}
      autoHideDuration={6000}
      onClose={handleClose}
      message={notificationContext.message}
      action={[
        (
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ),
      ]}
    />
  )
}

export default Notification
