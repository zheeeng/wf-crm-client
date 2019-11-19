import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import useNotification from '~src/containers/useNotification'

import Icon, { ICONS } from '~src/units/Icons'

export interface Props {
}

const useStyles = makeStyles(() => ({
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const Notification: React.FC = () => {
  const { message, dismiss } = useNotification()
  const classes = useStyles()

  const handleClose = useCallback(
    (_: any, reason?: string) => {
      if (reason === 'clickaway') return

      dismiss()
    },
    [dismiss],
  )

  return (
    <Snackbar
      ContentProps={{ classes: { message: classes.message } }}
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
            <Icon name={ICONS.Close} />
          </IconButton>
        ),
      ]}
    />
  )
}

export default Notification
