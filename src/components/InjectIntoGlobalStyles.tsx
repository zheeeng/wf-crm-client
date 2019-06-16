import React from 'react'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import cssTips from '~src/utils/cssTips'

const useGlobalStyles = makeStyles((theme: Theme) => ({
  '@global': {
    'div[role="group"][tabindex]': {
      ...cssTips(theme).casFlex(),
      height: '100%',
    },
    body: {
      fontFamily: [
        '"Open sans"',
        'sans-serif',
      ].join(','),
    },
  },
}))

const InjectIntoGlobalStyles: React.FC = () => {
  useGlobalStyles({})

  return null
}

export default InjectIntoGlobalStyles
