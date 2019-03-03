import React, { useState, useEffect, useCallback, useRef } from 'react'
import createContainer from 'constate'

const defaultDismissTimeout = 4000

const AlertContainer = createContainer(() => {
  const [message, updateMessage] = useState<{
    type: 'success' | 'fail',
    content: React.ReactNode,
  } | null>(null)

  const timerRef = useRef(0)

  const success = useCallback(
    (content: React.ReactNode) => {updateMessage({ type: 'success', content }) },
    [],
  )
  const fail = useCallback(
    (content: React.ReactNode) => {updateMessage({ type: 'fail', content }) },
    [],
  )

  const dismiss = useCallback(
    () => { updateMessage(null) },
    [],
  )

  useEffect(
    () => {
      if (message) {
        if (timerRef.current) window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(dismiss, defaultDismissTimeout)
      } else {
        if (timerRef.current) window.clearTimeout(timerRef.current)
      }
    },
    [message],
  )

  return {
    message,
    success,
    fail,
    dismiss,
  }
})

export default AlertContainer
