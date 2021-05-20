import React, { useState, useCallback } from 'react'
import constate from 'constate'

export const [UseNotificationProvider, useNotification] = constate(() => {
  const [message, updateMessage] = useState<React.ReactNode>(null)

  const notify = useCallback(
    (msg: React.ReactNode) => {
      updateMessage(msg)
    },
    [updateMessage],
  )

  const dismiss = useCallback(() => {
    updateMessage(null)
  }, [updateMessage])

  return {
    message,
    notify,
    dismiss,
  }
})
