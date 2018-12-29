import React, { useState, useCallback } from 'react'
import createContainer from 'constate'

const NotificationContainer = createContainer(() => {
  const [message, updateMessage] = useState<React.ReactNode>(null)

  const notify = useCallback(
    (msg: React.ReactNode) => { updateMessage(msg) },
    [],
  )

  const dismiss = useCallback(
    () => { updateMessage(null) },
    [],
  )

  return {
    message,
    notify,
    dismiss,
  }
})

export default NotificationContainer
