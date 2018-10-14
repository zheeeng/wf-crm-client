import * as React from 'react'
import { WithContext } from '@roundation/store'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import store from '~src/services/notification'

export interface Props extends WithContext<typeof store, 'notificationContext'> {
}

export class Notification extends React.PureComponent<Props> {
  private anchorOrigin = {
    vertical: 'bottom' as 'bottom',
    horizontal: 'left' as 'left',
  }

  private handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    this.props.notificationContext.handleClose()
  }

  closeIconNode = (
    <IconButton
      key="close"
      aria-label="Close"
      color="inherit"
      onClick={this.handleClose}
    >
      <CloseIcon />
    </IconButton>
  )

  render () {
    const { message } = this.props.notificationContext

    return (
      <Snackbar
        anchorOrigin={this.anchorOrigin}
        open={!!message}
        autoHideDuration={6000}
        onClose={this.handleClose}
        message={message}
        action={[this.closeIconNode]}
      />
    )
  }
}

export default store.connect(Notification, 'notificationContext')
