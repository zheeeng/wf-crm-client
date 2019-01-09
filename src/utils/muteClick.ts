import React from 'react'

const muteClick = <T, E>(fn: (e: React.MouseEvent<E>) => T) => (e: React.MouseEvent<E>): T => {
  e.preventDefault()
  e.stopPropagation()

  return fn(e)
}

export default muteClick
