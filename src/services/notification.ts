import React from 'react'
import createStore from '@roundation/store'

const store = createStore(setState => ({
  message: null as React.ReactNode,
  handleOpen (message: React.ReactNode) {
    setState({
      message,
    })
  },
  handleClose () {
    setState({
      message: null,
    })
  },
}))

export default store
