import React, { useState, useCallback } from 'react'
import createContainer from 'constate'

const AlertContainer = createContainer(() => {
  const [message, updateMessage] = useState<React.ReactNode>(null)

  const alert = useCallback(
    (msg: React.ReactNode) => { updateMessage(msg) },
    [],
  )

  const dismiss = useCallback(
    () => { updateMessage(null) },
    [],
  )

  return {
    message,
    alert,
    dismiss,
  }
})

export default AlertContainer
