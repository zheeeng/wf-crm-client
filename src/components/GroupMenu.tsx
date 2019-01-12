import React, { useState, useContext, useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Searcher from '~src/units/Searcher'

import GroupsContainer from '~src/containers/Groups'

const useStyles = makeStyles((theme: Theme) => ({
  nestedItem: {
    paddingLeft: theme.spacing.unit * 6,
  },
  activeItem: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}))

export interface Props {
  groupsOpened: boolean
  onClickGroup: (id: string) => void
}

const GroupMenu: React.FC<Props> = ({ groupsOpened, onClickGroup }) => {
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
        .filter(group => group.info.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [groups, searchTerm],
  )

  const handleSearchTermChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value),
    [searchTerm],
  )

  return (
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
            onClick={handleOnClick(group.id)}
          >
            <ListItemText
              classes={{
                primary: group.id === groupId ? classes.activeItem : '',
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
