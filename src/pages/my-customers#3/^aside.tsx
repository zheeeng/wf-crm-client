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
import Collapse from '@material-ui/core/Collapse'
import Hidden from '@material-ui/core/Hidden'

import Add from '@material-ui/icons/Add'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Searcher from '~src/units/Searcher'
import MaterialIcon from '~src/units/MaterialIcon'
import appStore from '~src/services/app'
import contactsStore from '~src/services/contacts'
import groupsStore from '~src/services/groups'
import SiderBarThemeProvider from '~src/theme/SiderBarThemeProvider'

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
  nestedItem: {
    paddingLeft: theme.spacing.unit * 6,
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
  WithContext<typeof contactsStore, 'contactsStore'>,
  WithContext<typeof groupsStore, 'groupsStore'> {
}

export interface State {
  groupsOpened: boolean
  searchText: string
}

class Aside extends React.Component<Props, State> {
  state: State = {
    groupsOpened: false,
    searchText: '',
  }

  get filteredGroups () {
    const { searchText } = this.state

    if (!searchText) return this.props.groupsStore.groups

    return this.props.groupsStore.groups
      .filter(group => group.info.name.toLowerCase().includes(searchText.toLowerCase()))
  }

  private handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchText: e.target.value,
    })
  }

  private navigateToGroup = (id: string) => () => {
    this.props.navigate && this.props.navigate(`${id}`)
  }

  private handleGroupsOpenedToggled = (opened?: boolean) => () => {
    this.setState({
      groupsOpened: opened !== undefined ? opened : !this.state.groupsOpened,
    })
  }

  private $mountEl = document.querySelector('#sidebar')

  private renderLinkLabel = (name: string) => {
    switch (name) {
      case 'All': {
        const allCounts = this.props.contactsStore.contacts.length

        return <ListItemText>{name}({allCounts})</ListItemText>
      }
      case 'Starred': {
        const starredCounts = this.props.contactsStore.contacts.filter(contact => contact.info.starred).length

        return <ListItemText>{name}({starredCounts})</ListItemText>
      }
      case 'Groups': {
        const groupsCount = this.props.groupsStore.groups.length

        return (
          <>
            <ListItemText>
              {name}({groupsCount})
            </ListItemText>
            <ListItemSecondaryAction>
              {this.state.groupsOpened
                ? <ExpandMore onClick={this.handleGroupsOpenedToggled(false)} />
                : <ChevronRight onClick={this.handleGroupsOpenedToggled(true)} />}
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
    <React.Fragment key={routePath}>
      <ListItem
        component={this.renderLinkWrapper(routePath)}
        button
      >
        <ListItemIcon>
          <MaterialIcon icon={icon} />
        </ListItemIcon>
        {this.renderLinkLabel(name)}
      </ListItem>
      {name === 'Groups' && this.renderGroups()}
    </React.Fragment>
  )

  private renderGroups = () => (
    <Collapse in={this.state.groupsOpened} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItem button>
          <Searcher
            placeholder="Type a group name"
            value={this.state.searchText}
            onChange={this.handleSearchTextChange}
          />
        </ListItem>
        {this.filteredGroups.map(group => (
          <ListItem
            key={group.id}
            button
            className={this.props.classes.nestedItem}
            onClick={this.navigateToGroup(group.id)}
          >
            <ListItemText>
              {group.info.name}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Collapse>
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
  groupsStore.connect(
    contactsStore.connect(
      withStyles(styles)(Aside),
      'contactsStore',
    ),
    'groupsStore',
  ),
  'appStore',
)
