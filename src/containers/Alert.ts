import React, { useState, useEffect, useCallback, useRef } from 'react'
import createContainer from 'constate'

const defaultDismissTimeout = 5000

const initialMessage: {
  expand: boolean,
  type: 'success' | 'fail',
  content: React.ReactNode,
} = {
  expand: false,
  type: 'success',
  content: null,
}

const AlertContainer = createContainer(() => {
  const [message, updateMessage] = useState(initialMessage)

  const timerRef = useRef(0)

  const success = useCallback(
    (content: React.ReactNode) => {
      updateMessage({ expand: true, type: 'success', content })
    },
    [updateMessage],
  )
  const fail = useCallback(
    (content: React.ReactNode) => {
      updateMessage({ expand: true, type: 'fail', content })
    },
    [updateMessage],
  )

  const reset = useCallback(
    () => updateMessage(initialMessage),
    [updateMessage],
  )

  const dismiss = useCallback(
    () =>  {
      updateMessage(message => ({ ...message, expand: false }))
      setTimeout(reset, 1000)
    },
    [updateMessage],
  )

  useEffect(
    () => {
      if (message.content) {
        if (timerRef.current) window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(dismiss, defaultDismissTimeout)
      } else {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current)
          timerRef.current = 0
        }
      }
    },
    [message],
  )

  return {
    message,
    success,
    fail,
    dismiss,
    reset,
  }
})

export default AlertContainer
