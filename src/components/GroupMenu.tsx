import React, { useState, useContext, useCallback, useMemo } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Searcher from '~src/units/Searcher'

import GroupsContainer from '~src/containers/Groups'

const useStyles = makeStyles((theme: Theme) => ({
  searchItem: {
    padding: theme.spacing(1.5, 4, 1.5, 3),
  },
  searchItemSimple: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  nestedItem: {
    padding: theme.spacing(1.5, 1, 1.5, 7),
  },
  selectedItem: {
    backgroundColor: theme.palette.grey[200],
  },
  activeItem: {
    backgroundColor: theme.palette.grey[100],
  },
  activeItemText: {
    ...{
      '&&': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    },
  },
  text: {
    color: theme.palette.text.hint,
    ...{
      '&&:hover': {
        backgroundColor: theme.palette.grey.A100,
      },
    },
  },
}))

export interface Props {
  selectedId?: string
  className?: string
  groupsOpened: boolean
  onClickGroup: (id: string) => void
  theme?: 'simple'
}

const GroupMenu: React.FC<Props> = ({ className, selectedId, groupsOpened, onClickGroup, theme }) => {
  const classes = useStyles({})

  const { groupId, groups } = useContext(GroupsContainer.Context)

  const [searchTerm, setSearchTerm] = useState('')

  const handleOnClick = useCallback(
    (id: string) => () => {
      onClickGroup(id)
    },
    [],
  )

  const filteredGroups = useMemo(
    () => !searchTerm
      ? groups
      : groups
        .filter(
          group => group.info.name.toLowerCase()
              .includes(searchTerm.toLowerCase())
            || (group.id && group.id === selectedId)
            || (group.id && group.id === groupId),
        ),
    [groups, searchTerm],
  )

  return (
    <Collapse
      className={className}
      in={groupsOpened}
      timeout="auto"
      unmountOnExit
    >
      <List disablePadding>
        <ListItem className={classnames(classes.searchItem, theme === 'simple' && classes.searchItemSimple)}>
          <Searcher
            placeholder="Type a group name"
            value={searchTerm}
            onChange={setSearchTerm}
            theme={theme}
          />
        </ListItem>
        {filteredGroups.map(group => (
          <ListItem
            key={group.id}
            button
            component="li"
            className={classnames(classes.nestedItem, theme === 'simple' && classes.text, group.id === groupId && classes.activeItem, group.id === selectedId && classes.selectedItem)}
            onClick={handleOnClick(group.id)}
          >
            <ListItemText
              classes={{
                primary: (group.id === groupId || group.id === selectedId)
                  ? classes.activeItemText
                  : undefined,
              }}
            >
              {group.info.name}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Collapse>
  )
}

export default GroupMenu
