import * as React from 'react'
import { Link } from '@roundation/roundation'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext } from '@roundation/store'
import Portal from '@material-ui/core/Portal'
import ToolBar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import Add from '@material-ui/icons/Add'
import ChevronRight from '@material-ui/icons/ChevronRight'
import MaterialIcon from '~src/units/MaterialIcon'
import appStore from '~src/services/app'
import contactsStore from '~src/services/contacts'
import SiderBarThemeProvider from '~src/theme/SiderBarThemeProvider'
import Hidden from '@material-ui/core/Hidden'

import { ComponentProps } from '@roundation/roundation/lib/types'

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  drawerPaper: {
    position: 'fixed',
    width: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0,
    // TODO:: Change to 100%
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 0 5px 1px lightgrey',
    flexGrow: 1,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
})

export interface Props extends
  WithStyles<typeof styles>,
  ComponentProps,
  WithContext<typeof appStore, 'appStore'>,
  WithContext<typeof contactsStore, 'contactStore'> {
}

class Aside extends React.Component<Props> {
  private $mountEl = document.querySelector('#sidebar')

  private renderLinkLabel = (name: string) => {
    switch (name) {
      case 'All': {
        const allCounts = this.props.contactStore.contacts.length

        return <ListItemText>{name}({allCounts})</ListItemText>
      }
      case 'Starred': {
        const starredCounts = this.props.contactStore.contacts.filter(contact => contact.info.starred).length

        return <ListItemText>{name}({starredCounts})</ListItemText>
      }
      case 'Groups': {
        return (
          <>
            <ListItemText>
              {name}
            </ListItemText>
            <ListItemSecondaryAction>
              <ChevronRight />
              <Add />
            </ListItemSecondaryAction>
          </>
        )
      }
      default: {
        return <ListItemText>{name}</ListItemText>
      }
    }
  }

  private renderLinkWrapper = (routePath: string) => (props: ListItemProps) => (
    <Link to={routePath} {...props} />
  )

  private renderLink = ({ routePath, name, icon }: { routePath: string, name: string, icon: string }) => (
    <ListItem
      key={routePath}
      component={this.renderLinkWrapper(routePath)}
      button
    >
      <ListItemIcon>
        <MaterialIcon icon={icon} />
      </ListItemIcon>
      {this.renderLinkLabel(name)}
    </ListItem>
  )

  private closeDrawer = () => {
    this.props.appStore.toggleDrawerExpanded(false)
  }

  private renderDrawer = (isTemporary: boolean) => {
    const { classes, locationInfo } = this.props
    const subPageNavs = locationInfo.list().map(({ routePath, name, icon }) => ({ routePath, name, icon }))

    return (
      <Drawer
        variant={isTemporary ? 'temporary' : 'permanent'}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={this.props.appStore.drawerExpanded}
        onClose={this.closeDrawer}
        BackdropProps={{
          invisible: true,
        }}
      >
        <ToolBar />
        <SiderBarThemeProvider>
          <List>
            <ListItem>
              <ListItemIcon>
                <MaterialIcon icon={'PermContactCalendar'} />
              </ListItemIcon>
              <ListItemText>
                Contacts
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List component="nav">
            {subPageNavs.map(this.renderLink)}
          </List>
        </SiderBarThemeProvider>
      </Drawer>
    )
  }

  render () {
    return (
      <>
        <Hidden mdDown>
            <Portal container={this.$mountEl}>
            {this.renderDrawer(false)}
          </Portal>
        </Hidden>
        <Hidden lgUp>
          {this.renderDrawer(true)}
        </Hidden>
      </>
    )
  }
}

export default appStore.connect(
  contactsStore.connect(
    withStyles(styles)(Aside),
    'contactStore',
  ),
  'appStore',
)
