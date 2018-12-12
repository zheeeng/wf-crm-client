import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Link } from '@roundation/roundation'
import { Theme } from '@material-ui/core/styles'
import classNames from 'classnames'
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
import BorderColor from '@material-ui/icons/BorderColor'
import ScreenShare from '@material-ui/icons/ScreenShare'
import Delete from '@material-ui/icons/Delete'

import Searcher from '~src/units/Searcher'
import MaterialIcon from '~src/units/MaterialIcon'
import appStore from '~src/services/app'
import sideStore from '~src/services/side'
import groupsStore from '~src/services/groups'
import SiderBarThemeProvider from '~src/theme/SiderBarThemeProvider'
import cssTips from '~src/utils/cssTips'

import { ComponentProps } from '@roundation/roundation/lib/types'

const useStyles = makeStyles((theme: Theme) => ({
  drawerPaper: {
    position: 'fixed',
    width: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.paper,
  },
  nestedItem: {
    paddingLeft: theme.spacing.unit * 6,
  },
  flexHeight: {
    flex: 1,
  },
  groupActions: {
    ...cssTips(theme, { sizeFactor: 1 }).horizontallySpaced,
  },
  invisible: {
    visibility: 'hidden',
    pointerEvents: 'none',
  },
}))

export interface Props extends ComponentProps {
}

const Aside: React.FC<Props> = React.memo(({ navigate, locationInfo }) => {
  const classes = useStyles({})

  const [searchTerm, setSearchTerm] = React.useState('')
  const [groupsOpened, setGroupsOpened] = React.useState(false)

  const appContext = React.useContext(appStore.Context)
  const groupsContext = React.useContext(groupsStore.Context)
  const sideContext = React.useContext(sideStore.Context)

  const $mountElRef = React.useRef(document.querySelector('#sidebar'))

  React.useEffect(
    () => {
      groupsContext.fetchGroups()
      sideContext.fetchInitialCount()
    },
    [],
  )

  const filteredGroups = React.useMemo(
    () => !searchTerm
      ? groupsContext.groups
      : groupsContext.groups
        .filter(group => group.info.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [groupsContext.groups, searchTerm],
  )

  const handleSearchTermChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    },
    [searchTerm],
  )

  const navigateToGroup = React.useCallback(
    (id: string) => () => {
      navigate && navigate(`groups/${id}`)
    },
    [navigate],
  )

  const handleGroupsOpenedToggled = React.useCallback(
    (opened?: boolean) => () => {
      setGroupsOpened(opened !== undefined ? opened : !groupsOpened)
    },
    [groupsOpened],
  )

  const renderLinkLabel = (name: string) => {
    switch (name) {
      case 'All': {
        return <ListItemText>{name}({sideContext.allCount})</ListItemText>
      }
      case 'Starred': {
        return <ListItemText>{name}({sideContext.starredCount})</ListItemText>
      }
      case 'Groups': {
        const groupsCount = groupsContext.groups.length

        return (
          <>
            <ListItemText>
              {name}({groupsCount})
            </ListItemText>
            <ListItemSecondaryAction>
              {
                groupsOpened
                  ? <ExpandMore onClick={handleGroupsOpenedToggled(false)} />
                  : <ChevronRight onClick={handleGroupsOpenedToggled(true)} />
              }
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

  const renderGroups = () => (
    <Collapse in={groupsOpened} timeout="auto" unmountOnExit>
      <List disablePadding>
        <ListItem button>
          <Searcher
            placeholder="Type a group name"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </ListItem>
        {filteredGroups.map(group => (
          <ListItem
            key={group.id}
            button
            className={classes.nestedItem}
            onClick={navigateToGroup(group.id)}
          >
            <ListItemText>
              {group.info.name}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Collapse>
  )

  const renderLinkWrapper = (routePath: string) => (props: ListItemProps) => (
    <Link to={routePath} {...props} />
  )

  const renderLink = ({ routePath, name, icon }: { routePath: string, name: string, icon: string }) => (
    <React.Fragment key={routePath}>
      <ListItem
        component={renderLinkWrapper(routePath)}
        button
      >
        <ListItemIcon>
          <MaterialIcon icon={icon} />
        </ListItemIcon>
        {renderLinkLabel(name)}
      </ListItem>
      {name === 'Groups' && renderGroups()}
    </React.Fragment>
  )

  const closeDrawer = () => {
    appContext.toggleDrawerExpanded(false)
  }

  const renderDrawer = (isTemporary: boolean) => {
    const subPageNavs = locationInfo.list().map(({ routePath, name, icon }) => ({ routePath, name, icon }))

    return (
      <Drawer
        variant={isTemporary ? 'temporary' : 'permanent'}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={appContext.drawerExpanded}
        onClose={closeDrawer}
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
          <List component="nav" className={classes.flexHeight}>
            {subPageNavs.map(renderLink)}
          </List>
          <List className={classNames(!groupsOpened && classes.invisible)}>
            <ListItem>
              <ListItemSecondaryAction className={classes.groupActions}>
                <BorderColor />
                <ScreenShare />
                <Delete />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </SiderBarThemeProvider>
      </Drawer>
    )
  }

  return (
    <>
      <Hidden mdDown>
          <Portal container={$mountElRef.current}>
          {renderDrawer(false)}
        </Portal>
      </Hidden>
      <Hidden lgUp>
        {renderDrawer(true)}
      </Hidden>
    </>
  )
})

export default Aside
