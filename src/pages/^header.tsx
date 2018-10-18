import * as React from 'react'
import { Link } from '@roundation/roundation'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext } from '@roundation/store'
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
import appStore from '~src/services/app'

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit * 8,
    ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced,
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-around',
      paddingRight: theme.spacing.unit * 4,
      paddingLeft: theme.spacing.unit * 4,
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-around',
      paddingRight: 0,
      paddingLeft: 0,
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
})

export interface Props extends WithStyles<typeof styles>, ComponentProps, WithContext<typeof appStore, 'appStore'> {}

export interface State {
  auth: boolean
  anchorEl: any
}

class Header extends React.Component<Props> {
  state = {
    anchorEl: null,
  }

  private $mountEl = document.querySelector('#header')

  private handleMenuOpenedChange = (forOpen: boolean) => (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ anchorEl: forOpen ? e.currentTarget : null })
  }

  private closeDrawer = () => {
    this.props.appStore.toggleDrawerExpanded()
  }

  render () {
    const { classes, locationInfo } = this.props
    const headers = locationInfo.list().map(({ name, routePath }) => ({ name, routePath}))
    const { anchorEl } = this.state
    const open = !!anchorEl

    return (
      <Portal container={this.$mountEl}>
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
                onClick={this.closeDrawer}
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
            {this.props.appStore.auth && (
              <div>
                <Button onClick={this.handleMenuOpenedChange(true)}>
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
                  open={open}
                  onClose={this.handleMenuOpenedChange(false)}
                >
                  <MenuItem onClick={this.handleMenuOpenedChange(false)}>Profile</MenuItem>
                  <MenuItem onClick={this.handleMenuOpenedChange(false)}>My account</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Portal>
    )
  }
}

export default appStore.connect(withStyles(styles)(Header), 'appStore')
