import * as React from 'react'
import { Link } from '@roundation/roundation'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Portal from '@material-ui/core/Portal'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { ComponentProps } from '@roundation/roundation/dist/types'

const styles = (theme: Theme) => createStyles({
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
    justifyContent: 'space-around',
    alignItems: 'center',
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
})

export interface Props extends WithStyles<typeof styles>, ComponentProps<any> {}

export interface State {
  auth: boolean
  anchorEl: any
}

class Header extends React.Component<Props> {
  state = {
    auth: true,
    anchorEl: null,
  }

  $mountEl = document.querySelector('#header')

  handleMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render () {
    const { classes, locationInfo } = this.props
    const headers = locationInfo.list().map(({ name, routePath }) => ({ name, routePath}))
    const { auth, anchorEl } = this.state
    const open = !!anchorEl

    return (
      <Portal container={this.$mountEl as any}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit">
              WaiverForever
            </Typography>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <div className={classes.navList}>
              {headers.map(({ name, routePath }) => (
                <Typography key={name} variant="subheading" color="inherit">
                  <Link to={routePath} className={classes.link}>{name}</Link>
                </Typography>
              ))}
            </div>
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
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Portal>
    )
  }
}

export default withStyles(styles)(Header)
