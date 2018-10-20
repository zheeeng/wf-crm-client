import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

const drawerWidth = 240

const mailFolderListItems = '123'
const otherMailFolderListItems = '123'

const styles = (theme: Theme) => createStyles({
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
})

export interface Props extends WithStyles<typeof styles> {
  header: JSX.Element | JSX.Element[]
}

export interface State {
  auth: boolean
  anchorEl: HTMLElement | null
}

class App extends React.Component<Props, State> {
  state: State = {
    auth: true,
    anchorEl: null,
  }

  private handleMenuToggle = (open: boolean) =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      this.setState({ anchorEl: open ? event.currentTarget : null })
    }

  render () {
    const { classes } = this.props
    const { auth, anchorEl } = this.state

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="subtitle1" color="inherit" className={classes.appBar}>
              WaiverForever
            </Typography>
            {this.props.header}
            {auth && (
              <div>
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
                  onClose={this.handleMenuToggle(false)}
                >
                  <MenuItem
                    onClick={this.handleMenuToggle(false)}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={this.handleMenuToggle(false)}
                  >
                    My account
                  </MenuItem>
                </Menu>
              </div>
            )}
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
        <main className={classes.content}>
          <Toolbar />
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default withStyles(styles)(App)
