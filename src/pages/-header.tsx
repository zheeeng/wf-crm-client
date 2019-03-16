import React, { useRef, useState, useContext, useCallback } from 'react'
import classnames from 'classnames'
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
import { ComponentProps } from '@roundation/roundation/lib/types'

import * as vars from '~src/theme/vars'

import logIcon from '~src/assets/logo.svg'
import cssTips from '~src/utils/cssTips'
import AppContainer from '~src/containers/App'
import AccountContainer from '~src/containers/Account'
import AlertContainer from '~src/containers/Alert'

import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    margin: '13px 40px',
    height: 30,
    width: 200,
    backgroundSize: '156px 22px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center left',
    backgroundImage: `url(${logIcon})`,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 2,
  },
  appBarRoot: {
    boxShadow: 'none',
  },
  toolBar: {
    padding: 0,
  },
  appAlert: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    marginTop: vars.HeaderHeight,
    width: '100%',
    height: theme.spacing.unit * 6,
    lineHeight: `${theme.spacing.unit * 6}px`,
    color: theme.palette.grey['50'],
    opacity: 0.6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateY(-100%)',
    transition: 'transform 1s',
  },
  successAlert: {
    backgroundColor: '#00cfbb',
  },
  failAlert: {
    backgroundColor: '#e53214',
  },
  alertDisplay: {
    transform: 'translateY(0)',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  navList: {
    display: 'flex',
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '30px',
    margin: '13px 0',
    overflow: 'hidden',
    ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced(),
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-around',
      paddingRight: theme.spacing.unit * 4,
      paddingLeft: theme.spacing.unit * 4,
      ...cssTips(theme, { sizeFactor: 4 }).horizontallySpaced(),
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-around',
      paddingRight: 0,
      paddingLeft: 0,
      ...cssTips(theme, { sizeFactor: 0 }).horizontallySpaced(),
    },
  },
  navItem: {
    display: 'inline-block',
    marginLeft: 25,
    marginRight: 25,
  },
  link: {
    color: 'inherit',
    opacity: 0.6,
    textDecoration: 'none',
    transition: 'opacity 0.5s',
    ...{
      '&.active': {
        opacity: 1,
      },
      '&:hover': {
        opacity: 1,
      },
    },
  },
}))

export interface Props extends ComponentProps {}

const Header: React.FC<Props> = React.memo(({ locationInfo, location }) => {
  const classes = useStyles({})
  const mountElRef = useRef(document.querySelector('#header'))
  const { toggleDrawerExpanded } = useContext(AppContainer.Context)
  const { message, dismiss } = useContext(AlertContainer.Context)
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

  const headers = locationInfo.list().map(({ name, routePath, routeFullPath }) => ({ name, routePath, routeFullPath }))

  return (
    <Portal container={mountElRef.current}>
      <div>
        <AppBar position="absolute" className={classes.appBar} classes={{root: classes.appBarRoot}}>
          <Toolbar variant="dense" className={classes.toolBar}>
            <Hidden mdDown>
              <div className={classes.logo} />
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
            <nav className={classes.navList}>
              {headers.map(({ name, routePath, routeFullPath }) => (
                <div key={name} className={classes.navItem}>
                  <Link
                    to={routePath}
                    className={classnames(
                      classes.link,
                      location && location.pathname.startsWith(routeFullPath) && 'active',
                    )}
                    >
                      {name}
                    </Link>
                </div>
              ))}
            </nav>
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
        <Typography
          variant="h6"
          className={classnames(
            message && classes.alertDisplay,
            classes.appAlert,
            (message && (message.type === 'success')) ? classes.successAlert : classes.failAlert,
          )}
          onClick={dismiss}
        >
          {message && message.content}
        </Typography>
      </div>
    </Portal>
  )
})

export default Header
