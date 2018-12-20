import React, { useRef, useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Link } from '@roundation/roundation'
import { Theme } from '@material-ui/core/styles'
import Portal from '@material-ui/core/Portal'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { ComponentProps } from '@roundation/roundation/lib/types'
import cssTips from '~src/utils/cssTips'
import AppContainer from '~src/containers/App'
import AccountContainer from '~src/containers/Account'

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  navList: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit * 8,
    overflow: 'hidden',
    ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced,
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-around',
      paddingRight: theme.spacing.unit * 4,
      paddingLeft: theme.spacing.unit * 4,
      ...cssTips(theme, { sizeFactor: 4 }).horizontallySpaced,
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-around',
      paddingRight: 0,
      paddingLeft: 0,
      ...cssTips(theme, { sizeFactor: 0 }).horizontallySpaced,
    },
  },
  link: {
    color: 'inherit',
    opacity: 0.8,
    fontSize: 'inherit',
    textDecoration: 'none',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    transition: 'opacity 0.5s',
    ...{
      '&:hover': {
        opacity: 1,
      },
    },
  },
}))

export interface Props extends ComponentProps {}

const Header: React.FC<Props> = React.memo(({ locationInfo }) => {
  const classes = useStyles({})
  const mountElRef = useRef(document.querySelector('#header'))
  const { toggleDrawerExpanded } = useContext(AppContainer.Context)
  const { authored, login, logout } = useContext(AccountContainer.Context)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleMenuToggle = useCallback(
    (forOpen: boolean) => (event: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(forOpen ? event.currentTarget : null)
    },
    [anchorEl],
  )
  const handleLogin = useCallback(
    () => {
      authored ? logout() : login('a', '0cc175b9c0f1b6a831c399e269772661')
      setAnchorEl(null)
    },
    [authored],
  )

  const headers = locationInfo.list().map(({ name, routePath }) => ({ name, routePath}))

  return (
    <Portal container={mountElRef.current}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <Hidden mdDown>
            <Typography variant="subtitle1" color="inherit">
              WaiverForever
            </Typography>
          </Hidden>
          <Hidden lgUp>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={toggleDrawerExpanded}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <div className={classes.navList}>
            {headers.map(({ name, routePath }) => (
              <Typography key={name} variant="subtitle1" color="inherit">
                <Link to={routePath} className={classes.link}>{name}</Link>
              </Typography>
            ))}
          </div>
          <div>
            <Button onClick={handleMenuToggle(true)}>
              <Typography>Open</Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={!!anchorEl}
              onClose={handleMenuToggle(false)}
            >
              <MenuItem onClick={handleMenuToggle(false)}>Profile</MenuItem>
              <MenuItem onClick={handleLogin}>
                {authored ? 'My account' : 'Log in'}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Portal>
  )
})

export default Header
