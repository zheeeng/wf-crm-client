import React from 'react'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'

const useGlobalStyles = makeStyles((theme: Theme) => ({
  '@global': {
    'div[role="group"][tabindex]': {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      minHeight: 0,
    },
    ...{
      body: {
        fontFamily: [
          '"Open sans"',
          '"Helvetica Neue"',
          'sans-serif',
        ].join(','),
      },
    },
  },
}))

const InjectIntoGlobalStyles: React.FC = () => {
  useGlobalStyles({})

  return null
}

export default InjectIntoGlobalStyles
