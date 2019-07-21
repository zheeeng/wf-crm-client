import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import cssTips from '~src/utils/cssTips'
import * as vars from '~src/theme/vars'

export const useLayoutStyles = makeStyles((theme: Theme) => ({
  root: {
    ...cssTips(theme).casFlex(),
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  main: {
    ...cssTips(theme).casFlex(),
    marginLeft: vars.SiderBarWidth,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    minWidth: 0,
    height: '100vh',
  },
  loadingContainer: {
    ...cssTips(theme).centerFlex(),
    width: '100%',
    height: '100%',
  },
  progress: {
    width: `${theme.spacing(8)}px`,
    height: `${theme.spacing(8)}px`,
  },
}))

export default useLayoutStyles
