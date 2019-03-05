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
import CheckCircle from '@material-ui/icons/CheckCircle'

import cond from 'ramda/es/cond'
import equals from 'ramda/es/equals'
import { ComponentProps } from '@roundation/roundation/lib/types'

import ContactIcon from '~src/assets/icons/side-contact.svg'
import PersonIcon from '~src/assets/icons/side-person.svg'
import StarIcon from '~src/assets/icons/side-star.svg'

import CreateForm, { CreateFormOption } from '~src/components/CreateForm'
import GroupMenu from '~src/components/GroupMenu'
import SiderBarThemeProvider from '~src/theme/SiderBarThemeProvider'
import cssTips from '~src/utils/cssTips'
import muteClick from '~src/utils/muteClick'
import AlertContainer from '~src/containers/Alert'
import ContactsCountContainer from '~src/containers/ContactsCount'
import GroupsContainer from '~src/containers/Groups'
import AppContainer from '~src/containers/App'
import { GroupFields } from '~src/types/Contact'
import * as vars from '~src/theme/vars'

const useStyles = makeStyles((theme: Theme) => ({
  titleText: {
    fontSize: 18,
    fontWeight: 600,
  },
  drawerPaper: {
    position: 'fixed',
    width: vars.SiderBarWidth,
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
  groupBtn: {
    cursor: 'pointer',
  },
}))

type FormType = '' | 'add' | 'update' | 'remove'

const getIcon = (icon: string): JSX.Element => {
  switch (icon) {
    case 'StarBorder':
      return <img src={StarIcon} />
    default:
      //'Person', 'Group'
      return <img src={PersonIcon} />
  }
}

export interface Props extends ComponentProps {
}

const Aside: React.FC<Props> = React.memo(({ navigate, locationInfo, location }) => {
  const classes = useStyles({})
  const { success } = useContext(AlertContainer.Context)
  const { contactsCount, starredCount } = useContext(ContactsCountContainer.Context)
  const { groupId, groups, addGroup, updateGroup, removeGroupData, removeGroup } = useContext(GroupsContainer.Context)
  const { drawerExpanded, toggleOffDrawerExpanded } = useContext(AppContainer.Context)

  useEffect(
    () => {
      removeGroupData && success(<><CheckCircle /> Contacts Removed</>)
    },
    [removeGroupData],
  )

  const {
    value: groupsOpened,
    toggle: toggleGroupsOpened,
  } = useToggle(false)

  const $mountElRef = useRef(document.querySelector('#sidebar'))

  const navigateToGroup = useCallback(
    (id: string) => navigate && navigate(`groups/${id}`),
    [navigate],
  )

  const [groupForm, setGroupForm] = useState({
    type: '' as FormType,
    opened: false,
    // tslint:disable-next-line:no-object-literal-type-assertion
    option: {} as CreateFormOption<any>,
  })

  const changeGroupFormOpened = useCallback<{
    <F extends string>(opened: true, type: FormType, option: CreateFormOption<F>): () => void;
    (opened: false): () => void;
  }>(
    <F extends string>(opened: boolean, type?: FormType, option?: CreateFormOption<F>) => () => {
      setGroupForm({
        type: type ? type : '',
        opened,
        option: opened ? option as CreateFormOption<F> : {},
      })
    },
    [groupForm],
  )

  const handleAddNewGroup = useCallback(
    async (group: object) => {
      addGroup(group as GroupFields)
      changeGroupFormOpened(false)()
    },
    [addGroup, changeGroupFormOpened],
  )

  const newGroupFormOption: CreateFormOption<keyof GroupFields> = {
    title: 'New Group',
    fields: ['Group name'],
    okText: 'Ok',
  }

  const updateGroupFormOption: CreateFormOption<keyof GroupFields> = {
    title: 'Update Group',
    fields: ['Group name'],
    okText: 'Ok',
  }

  const removeGroupFormOption: CreateFormOption<keyof GroupFields> = {
    title: 'Remove Group',
    tip: 'Are you sure you want to remove the selected group?',
    fields: [],
    okText: 'Ok',
  }

  const handleUpdateGroup = useCallback(
    async (group: object) => {
      updateGroup(group as GroupFields)
      changeGroupFormOpened(false)()
    },
    [updateGroup, changeGroupFormOpened],
  )

  const handleRemoveGroup = useCallback(
    async () => {
      removeGroup()
      changeGroupFormOpened(false)()
    },
    [removeGroup, changeGroupFormOpened],
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
            <Add onClick={muteClick(changeGroupFormOpened(true, 'add', newGroupFormOption))} />
          </ListItemSecondaryAction>
        </>
      )],
    ],
  )

  const renderLinkWrapper = (routePath: string, onClick?: () => void) => (props: ListItemProps) => (
    <Link to={routePath} {...props} onClick={onClick} />
  )

  const renderLink = (
    { routePath, routeFullPath, name, icon }:
    { routePath: string, routeFullPath: string, name: string, icon: string },
  ) => (
    <React.Fragment key={routePath}>
      <ListItem
        component={renderLinkWrapper(
          routePath,
          name === 'Groups' ? toggleGroupsOpened : undefined,
        )}
        classes={{ button: (location && location.pathname.startsWith(routeFullPath)) ? 'active' : '' }}
        button
      >
        <ListItemIcon>
          {getIcon(icon)}
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
    const subPageNavs = locationInfo.list().map(
      ({ routeFullPath, routePath, name, icon }) => ({ routeFullPath, routePath, name, icon }),
    )

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
        <ToolBar variant="dense" />
        <SiderBarThemeProvider>
          <List component="nav" className={classes.flexHeight}>
            <ListItem component="div">
              <ListItemIcon>
                <img src={ContactIcon} />
              </ListItemIcon>
              <ListItemText classes={{primary: classes.titleText}}>
                Contacts
              </ListItemText>
            </ListItem>
            <Divider />
            {subPageNavs.map(renderLink)}
            <List
              component="nav"
              className={classNames((!groupsOpened || !groupId) && classes.invisible)}
            >
              <ListItem component="div">
                <ListItemSecondaryAction className={classes.groupActions}>
                  <BorderColor
                    className={classes.groupBtn}
                    onClick={changeGroupFormOpened(true, 'update', updateGroupFormOption)}
                  />
                  <ScreenShare
                    className={classes.groupBtn}
                  />
                  <Delete
                    className={classes.groupBtn}
                    onClick={changeGroupFormOpened(true, 'remove', removeGroupFormOption)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </List>
        </SiderBarThemeProvider>
      </Drawer>
    )
  }

  return (
    <>
      <CreateForm
        option={groupForm.option}
        open={groupForm.opened}
        onClose={changeGroupFormOpened(false)}
        onOk={
          groupForm.type === 'add'
            ? handleAddNewGroup
            : groupForm.type === 'update'
              ? handleUpdateGroup
              : groupForm.type === 'remove'
                ? handleRemoveGroup
                : undefined
          }
      />
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
