import React, { useState, useCallback } from 'react'
import useDebounce from 'react-use/lib/useDebounce'
import constate from 'constate'

const defaultDismissTimeout = 5000

const initialMessage: {
  expand: boolean
  type: 'success' | 'fail'
  content: React.ReactNode
} = {
  expand: false,
  type: 'success',
  content: null,
}

export const [UseAlertProvider, useAlert] = constate(() => {
  const [message, updateMessage] = useState(initialMessage)

  const success = useCallback(
    (content: React.ReactNode) =>
      updateMessage({ expand: true, type: 'success', content }),
    [updateMessage],
  )
  const fail = useCallback(
    (content: React.ReactNode) =>
      updateMessage({ expand: true, type: 'fail', content }),
    [updateMessage],
  )

  const reset = useCallback(
    () => updateMessage(initialMessage),
    [updateMessage],
  )

  const dismiss = useCallback(
    () => updateMessage((message) => ({ ...message, expand: false })),
    [updateMessage],
  )

  useDebounce(reset, 1000, [dismiss])

  useDebounce(() => message.content && dismiss(), defaultDismissTimeout, [
    message,
    dismiss,
  ])

  return {
    message,
    success,
    fail,
    dismiss,
    reset,
  }
})
