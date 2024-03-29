import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useBoolean } from 'react-hanger'
import { makeStyles } from '@material-ui/styles'
import { Link, ComponentProps } from '@roundation/roundation'
import { Theme } from '@material-ui/core/styles'
import classnames from 'classnames'
import Portal from '@material-ui/core/Portal'
import ToolBar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'
import Hidden from '@material-ui/core/Hidden'

import CreateForm, { CreateFormOption } from '~src/components/CreateForm'
import GroupMenu from '~src/components/GroupMenu'
import SiderBarThemeProvider from '~src/theme/SiderBarThemeProvider'
import { noop } from '~src/utils/noop'
import cssTips from '~src/utils/cssTips'
import muteClick from '~src/utils/muteClick'
import { useSideDrawer } from '~src/containers/useSideDrawer'
import { useContactsCount } from '~src/containers/useContactsCount'
import { useGroups } from '~src/containers/useGroups'
import { GroupFields } from '~src/types/Contact'
import * as vars from '~src/theme/vars'

import Icon, { ICONS } from '~src/units/Icons'

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
  flexWrapper: {
    ...cssTips(theme).casFlex(),
  },
  flexHeight: {
    height: theme.spacing(7),
    minHeight: theme.spacing(7),
  },
  groupActions: {
    ...cssTips(theme, { sizeFactor: 1 }).horizontallySpaced(),
  },
  invisible: {
    visibility: 'hidden',
    pointerEvents: 'none',
  },
  groupBtn: {
    cursor: 'pointer',
  },
  groupAddIcon: {
    padding: 2,
    marginTop: theme.spacing(1),
  },
  groupStatusIcon: {
    padding: 2,
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    transition: 'transform ease 0.3s',
  },
  statusIconRotate90: {
    transform: 'rotate(90deg)',
  },
}))

type FormType = '' | 'add' | 'update' | 'remove'

export interface Props extends ComponentProps {}

const Aside: React.FC<Props> = React.memo(
  ({ navigate, locationInfo, location }) => {
    const classes = useStyles({})
    const { contactsCount, starredCount } = useContactsCount()
    const { groupIdState, groups, addGroup, updateGroup, removeGroup } =
      useGroups()
    const sideDrawer = useSideDrawer()

    const {
      value: groupsOpened,
      toggle: toggleGroupsOpened,
      setTrue: toggleOnGroupsOpened,
    } = useBoolean(false)

    const $mountElRef = useRef(document.querySelector('#sidebar'))

    const navigateToGroup = useCallback(
      (id?: string) => navigate && navigate(id ? `groups/${id}` : 'all'),
      [navigate],
    )

    const [groupForm, setGroupForm] = useState<{
      type: FormType
      opened: boolean
      option?: CreateFormOption
    }>({
      type: '',
      opened: false,
    })

    const changeGroupFormOpened = useCallback<{
      (opened: true, type: FormType, option: CreateFormOption): () => void
      (opened: false): () => void
    }>(
      (opened: boolean, type?: FormType, option?: CreateFormOption) => () => {
        setGroupForm({
          type: type ? type : '',
          opened,
          option: opened ? option : undefined,
        })
      },
      [],
    )

    const handleAddNewGroup = useCallback(
      async (group: Record<string, unknown>) => {
        if (groups.some((g) => g.info.name === (group as GroupFields).name)) {
          return
        }
        const id = await addGroup(group as GroupFields)
        changeGroupFormOpened(false)()
        navigateToGroup(id)
        toggleOnGroupsOpened()
      },
      [
        addGroup,
        changeGroupFormOpened,
        groups,
        navigateToGroup,
        toggleOnGroupsOpened,
      ],
    )

    useEffect(() => {
      if (groupIdState.value) toggleOnGroupsOpened()
    }, [groupIdState.value, toggleOnGroupsOpened])

    const newGroupFormOption = useMemo<CreateFormOption>(
      () => ({
        title: 'New group',
        fields: [
          {
            type: 'text',
            name: 'name',
            label: 'Group name',
            required: true,
          },
        ],
        okTextWatch: 'name',
        okText: (name: string) =>
          groups.some((group) => group.info.name === name)
            ? 'Group existed'
            : 'Ok',
        okColor: (name: string) =>
          groups.some((group) => group.info.name === name)
            ? 'default'
            : 'primary',
      }),
      [groups],
    )

    const updateGroupFormOption: CreateFormOption = useMemo(
      () => ({
        title: 'Update group',
        fields: [
          {
            type: 'text',
            name: 'name',
            label: 'Group name',
            required: true,
          },
        ],
        okText: 'Ok',
      }),
      [],
    )

    const removeGroupFormOption: CreateFormOption = {
      title: 'Remove group',
      tip: 'Are you sure you want to remove the selected group?',
      fields: [],
      okText: 'Ok',
    }

    const handleUpdateGroup = useCallback(
      async (group: Record<string, unknown>) => {
        updateGroup(group as GroupFields)
        changeGroupFormOpened(false)()
      },
      [updateGroup, changeGroupFormOpened],
    )

    const handleRemoveGroup = useCallback(async () => {
      removeGroup()
      changeGroupFormOpened(false)()
      navigateToGroup()
    }, [removeGroup, changeGroupFormOpened, navigateToGroup])

    const renderIcon = (icon: string) => {
      switch (icon) {
        case 'Starred':
          return <Icon name={ICONS.SideStarred} />
        case 'Group':
          return <Icon name={ICONS.SideGroup} />
        default:
          return <Icon name={ICONS.SideAll} />
      }
    }

    const renderLinkLabel = useCallback(
      (name: string) => {
        switch (name) {
          case 'All':
            return (
              <ListItemText key={name}>
                {name}({contactsCount})
              </ListItemText>
            )
          case 'Starred':
            return (
              <ListItemText key={name}>
                {name}({starredCount})
              </ListItemText>
            )
          case 'Groups':
            return (
              <>
                <ListItemText key={name}>
                  {name}({groups.length})
                </ListItemText>
                <ListItemSecondaryAction key={name + 'action'}>
                  <Icon
                    color="hoverLighten"
                    name={ICONS.ChevronRight}
                    className={classnames(
                      classes.groupStatusIcon,
                      groupsOpened && classes.statusIconRotate90,
                    )}
                    size="sm"
                  />
                  <Icon
                    color="hoverLighten"
                    name={ICONS.Add}
                    onClick={muteClick(
                      changeGroupFormOpened(true, 'add', newGroupFormOption),
                    )}
                    className={classes.groupAddIcon}
                    size="sm"
                  />
                </ListItemSecondaryAction>
              </>
            )
          default:
            throw Error('impossible')
        }
      },
      [
        changeGroupFormOpened,
        classes.groupAddIcon,
        classes.groupStatusIcon,
        classes.statusIconRotate90,
        contactsCount,
        groups.length,
        groupsOpened,
        newGroupFormOption,
        starredCount,
      ],
    )

    const handleLinkClick = useCallback(
      (name: string) => (name === 'Groups' ? toggleGroupsOpened : noop),
      [toggleGroupsOpened],
    )

    const renderLink = ({
      routePath,
      routeFullPath,
      name,
      icon,
    }: {
      routePath: string
      routeFullPath: string
      name: string
      icon: string
    }) => (
      <React.Fragment key={name}>
        <ListItem
          key={name + 'context'}
          component={Link}
          state={{ fromAside: true }}
          classes={{
            button:
              location && location.pathname.startsWith(routeFullPath)
                ? 'active'
                : '',
          }}
          button
          onClick={handleLinkClick(name)}
          to={name === 'Groups' && location ? location.pathname : routePath}
        >
          <ListItemIcon>{renderIcon(icon)}</ListItemIcon>
          {renderLinkLabel(name)}
        </ListItem>
        {name === 'Groups' && (
          <GroupMenu
            key={name + 'group'}
            groupsOpened={groupsOpened}
            onClickGroup={navigateToGroup}
          />
        )}
      </React.Fragment>
    )

    const renderDrawer = (isTemporary: boolean) => {
      const subPageNavs = locationInfo
        .list()
        .map(({ routeFullPath, routePath, name, icon }) => ({
          routeFullPath,
          routePath,
          name,
          icon,
        }))

      return (
        <Drawer
          variant={isTemporary ? 'temporary' : 'permanent'}
          classes={{
            paper: classes.drawerPaper,
          }}
          open={sideDrawer.value}
          onClose={sideDrawer.setFalse}
          BackdropProps={{
            invisible: true,
          }}
        >
          <ToolBar variant="dense" />
          <SiderBarThemeProvider>
            <List
              component="nav"
              className={classnames(classes.flexWrapper, classes.flexHeight)}
              disablePadding
            >
              <ListItem component="div">
                <ListItemIcon>
                  <Icon name={ICONS.SideContact} />
                </ListItemIcon>
                <ListItemText classes={{ primary: classes.titleText }}>
                  Contacts
                </ListItemText>
              </ListItem>
              <Divider />
              {subPageNavs.map(renderLink)}
              <List
                component="nav"
                className={classnames(
                  (!groupsOpened || !groupIdState.value) && classes.invisible,
                )}
              >
                <ListItem component="div">
                  <ListItemSecondaryAction className={classes.groupActions}>
                    <Icon
                      color="hoverLighten"
                      name={ICONS.Edit}
                      className={classes.groupBtn}
                      onClick={changeGroupFormOpened(
                        true,
                        'update',
                        updateGroupFormOption,
                      )}
                    />
                    {/* <Icon name={ICONS.Export}
                    className={classes.groupBtn}
                  /> */}
                    <Icon
                      color="hoverLighten"
                      name={ICONS.Delete}
                      className={classes.groupBtn}
                      onClick={changeGroupFormOpened(
                        true,
                        'remove',
                        removeGroupFormOption,
                      )}
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
        {groupForm.opened && (
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
        )}
        <Hidden mdDown>
          <Portal container={$mountElRef.current}>{renderDrawer(false)}</Portal>
        </Hidden>
        <Hidden lgUp>{renderDrawer(true)}</Hidden>
      </>
    )
  },
)

export default Aside
