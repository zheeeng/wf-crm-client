import React, { useContext, useCallback } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import NotificationContainer from '~src/containers/Notification'

export interface Props {
}

const Notification: React.FC = () => {
  const { message, dismiss } = useContext(NotificationContainer.Context)

  const handleClose = useCallback(
    (_: any, reason?: string) => {
      if (reason === 'clickaway') return

      dismiss()
    },
    [dismiss],
  )

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={!!message}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
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
