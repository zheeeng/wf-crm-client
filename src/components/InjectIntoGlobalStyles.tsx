import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useGlobalStyles = makeStyles({
  '@global': {
    'div[role="group"][tabindex]': {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
  },
})

const InjectIntoGlobalStyles: React.FC = () => {
  useGlobalStyles({})

  return null
}

export default InjectIntoGlobalStyles
