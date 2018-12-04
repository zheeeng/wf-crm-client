import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import appStore from '~src/services/app'

import { ComponentProps } from '@roundation/roundation/lib/types'

const drawerWidth = 240

const mailFolderListItems = '123'
const otherMailFolderListItems = '123'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'fixed',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    marginLeft: drawerWidth,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0,
  },
}))

export interface Props extends ComponentProps<'header'> {
}

const App: React.FC<Props> = React.memo(({ slots, children }) => {
  const classes = useStyles({})
  const appContext = React.useContext(appStore.Context)
  const { authored } = appContext
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const handleMenuToggle = React.useCallback(
    (open: boolean) => (event: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(open ? event.currentTarget : null)
    },
    [anchorEl],
  )
  const handleLogin = React.useCallback(
    () => {
      if (authored) {
        appContext.logout()
      } else {
        appContext.login('a', '0cc175b9c0f1b6a831c399e269772661')
      }
      setAnchorEl(null)
    },
    [authored],
  )

  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <Typography variant="subtitle1" color="inherit" className={classes.appBar}>
            WaiverForever
          </Typography>
          {slots.header}
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
            <MenuItem onClick={handleMenuToggle(false)}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogin}>
              {authored ? 'My account' : 'Log in'}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <List>{mailFolderListItems}</List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
      </Drawer>
      <div className={classes.content}>
        <Toolbar />
        {children}
      </div>
    </div>
  )
})

export default App
