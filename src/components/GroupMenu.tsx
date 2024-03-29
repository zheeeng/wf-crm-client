import React, { useCallback, useMemo } from 'react'
import { useInput } from 'react-hanger'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Searcher from '~src/units/Searcher'
import cssTips from '~src/utils/cssTips'

import { useGroups } from '~src/containers/useGroups'

const useStyles = makeStyles((theme: Theme) => ({
  searchCollapse: {
    overflow: 'hidden',
  },
  flexContainer: {
    ...cssTips(theme).casFlex(),
  },
  simpleFlexContainer: {
    display: 'block',
  },
  simpleResultBox: {
    height: 320,
  },
  resultBox: {
    overflow: 'auto',
  },
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
  itemText: {
    wordBreak: 'break-all',
  },
  activeItemText: {
    '&&': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
  text: {
    color: theme.palette.text.hint,
    '&&:hover': {
      backgroundColor: theme.palette.grey.A100,
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

const GroupMenu: React.FC<Props> = ({
  className,
  selectedId,
  groupsOpened,
  onClickGroup,
  theme,
}) => {
  const classes = useStyles({})

  const { groupIdState, groups } = useGroups()

  const searchTermState = useInput('')

  const handleChangeSearchTerm = useCallback(
    (value: string) => {
      searchTermState.setValue(value)
      onClickGroup('')
    },
    [searchTermState, onClickGroup],
  )

  const handleOnClick = useCallback(
    (id: string) => () => {
      onClickGroup(id)
    },
    [onClickGroup],
  )

  const filteredGroups = useMemo(
    () =>
      !searchTermState.hasValue
        ? groups
        : groups.filter((group) =>
            group.info.name
              .toLowerCase()
              .includes(searchTermState.value.toLowerCase()),
          ),
    [groups, searchTermState],
  )

  return (
    <Collapse
      className={className}
      classes={{
        container: classnames(classes.flexContainer, classes.searchCollapse),
        wrapper: classes.flexContainer,
        wrapperInner: classnames(
          classes.flexContainer,
          theme === 'simple' && classes.simpleFlexContainer,
        ),
      }}
      in={groupsOpened}
      timeout="auto"
      unmountOnExit
    >
      <ListItem
        component="div"
        className={classnames(
          classes.searchItem,
          theme === 'simple' && classes.searchItemSimple,
        )}
      >
        <Searcher
          placeholder="Type a group name"
          value={searchTermState.value}
          onChange={handleChangeSearchTerm}
          theme={theme}
        />
      </ListItem>
      <List
        className={classnames(
          classes.flexContainer,
          classes.resultBox,
          theme === 'simple' && classes.simpleResultBox,
        )}
        disablePadding
      >
        {filteredGroups.map((group) => (
          <ListItem
            key={group.id}
            button
            component="li"
            className={classnames(
              classes.nestedItem,
              theme === 'simple' && classes.text,
              group.id === groupIdState.value && classes.activeItem,
              group.id === selectedId && classes.selectedItem,
            )}
            onClick={handleOnClick(group.id)}
          >
            <ListItemText
              classes={{
                primary:
                  group.id === groupIdState.value || group.id === selectedId
                    ? classes.activeItemText
                    : undefined,
                root: classes.itemText,
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
