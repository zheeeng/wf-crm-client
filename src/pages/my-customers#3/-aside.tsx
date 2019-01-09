import React, { useState, useContext, useEffect, useCallback, useRef, useMemo } from 'react'
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
import Hidden from '@material-ui/core/Hidden'
import useToggle from '~src/hooks/useToggle'

import Add from '@material-ui/icons/Add'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ExpandMore from '@material-ui/icons/ExpandMore'
import BorderColor from '@material-ui/icons/BorderColor'
import ScreenShare from '@material-ui/icons/ScreenShare'
import Delete from '@material-ui/icons/Delete'

import GroupMenu from '~src/components/GroupMenu'
import MaterialIcon from '~src/units/MaterialIcon'
import SiderBarThemeProvider from '~src/theme/SiderBarThemeProvider'
import cssTips from '~src/utils/cssTips'
import muteClick from '~src/utils/muteClick'
import ContactsCountContainer from '~src/containers/ContactsCount'
import AppContainer from '~src/containers/App'
import cond from 'ramda/es/cond'
import equals from 'ramda/es/equals'

import { ComponentProps } from '@roundation/roundation/lib/types'

const useStyles = makeStyles((theme: Theme) => ({
  drawerPaper: {
    position: 'fixed',
    width: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.paper,
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
  const { contactsCount, starredCount, groups } = useContext(ContactsCountContainer.Context)
  const { drawerExpanded, toggleOffDrawerExpanded } = useContext(AppContainer.Context)

  const {
    value: groupsOpened,
    toggle: toggleGroupsOpened,
  } = useToggle(false)

  const {
    value: addGroupModalOpened,
    toggleOn: toggleOnAddGroupModalOpenedFn,
  } = useToggle(false)

  const toggleOnAddGroupModalOpened = useCallback(
    () => muteClick(toggleOnAddGroupModalOpenedFn),
    [],
  )

  const $mountElRef = useRef(document.querySelector('#sidebar'))

  const navigateToGroup = useCallback(
    (id: string) => () => navigate && navigate(`groups/${id}`),
    [navigate],
  )

  const renderLinkLabel = cond(
    [
      [equals('All'), name => <ListItemText>{name}({contactsCount})</ListItemText>],
      [equals('Starred'), name => <ListItemText>{name}({starredCount})</ListItemText>],
      [equals('Groups'), name => (
        <>
          <ListItemText>
            {name}({groups.length})
          </ListItemText>
          <ListItemSecondaryAction>
            {groupsOpened
              ? <ExpandMore />
              : <ChevronRight />
            }
            <Add onClick={toggleOnAddGroupModalOpened} />
          </ListItemSecondaryAction>
        </>
      )],
    ],
  )

  const renderLinkWrapper = (routePath: string, onClick?: () => void) => (props: ListItemProps) => (
    <Link to={routePath} {...props} onClick={onClick} />
  )

  const renderLink = ({ routePath, name, icon }: { routePath: string, name: string, icon: string }) => (
    <React.Fragment key={routePath}>
      <ListItem
        component={renderLinkWrapper(
          routePath,
          name === 'Groups' ? toggleGroupsOpened : undefined,
        )}
        button
      >
        <ListItemIcon>
          <MaterialIcon icon={icon} />
        </ListItemIcon>
        {renderLinkLabel(name)}
      </ListItem>
      {name === 'Groups' && (
        <GroupMenu
          groupsOpened={groupsOpened}
          onClickGroup={navigateToGroup}
        />
      )}
    </React.Fragment>
  )

  const renderDrawer = (isTemporary: boolean) => {
    const subPageNavs = locationInfo.list().map(({ routePath, name, icon }) => ({ routePath, name, icon }))

    return (
      <Drawer
        variant={isTemporary ? 'temporary' : 'permanent'}
        classes={{
          paper: classes.drawerPaper,
        }}
        open={drawerExpanded}
        onClose={toggleOffDrawerExpanded}
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
