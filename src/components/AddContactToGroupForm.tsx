import React, { useCallback, useEffect, useMemo } from 'react'
import { useBoolean, useInput } from 'react-hanger'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import BasicFormInput from '~src/units/BasicFormInput'
import cssTips from '~src/utils/cssTips'
import GroupMenu from '~src/components/GroupMenu'
import useAlert from '~src/containers/useAlert'
import useGroups from '~src/containers/useGroups'

import Icon, { ICONS } from '~src/units/Icons'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    width: Math.min(theme.breakpoints.values.sm, 388),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    border: 'none',
    outline: '#efefef inset 1px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      ...{
        '&&': {
          marginLeft: 0,
          marginRight: 0,
        }
      }
    },
  },
  groupMenu: {
    overflow: 'auto',
  },
  buttonZone: {
    textAlign: 'right',
    marginTop: theme.spacing(4),
    ...cssTips(theme).horizontallySpaced(),
    ...{
      '& button': {
        fontWeight: 600,
      },
    },
  },
  label: {
    ...cssTips(theme).centerFlex('space-between'),
    lineHeight: `${theme.spacing(4)}px`,
    height: theme.spacing(4),
    padding: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}))

export interface Props {
  open: boolean
  onClose: () => void
  onOk: (groupId: string) => Promise<any>
}

const AddContactToGroupForm: React.FC<Props> = React.memo(({ open, onClose, onOk }) => {
  const { fail } = useAlert()
  const { addGroup, addGroupError, groups } = useGroups()
  const classes = useStyles({})

  useEffect(
    () => { addGroupError && fail(addGroupError.message) },
    [addGroupError, fail],
  )

  const newGroupNameState = useInput('')
  const selectedGroupIdState = useInput('')

  const { value: groupsOpened, toggle: toggleGroupsOpened, setTrue: toggleOnGroupsOpened } = useBoolean(true)

  const isGroupExisted = useMemo(
    () => newGroupNameState.hasValue && groups.some(group => group.info.name === newGroupNameState.value),
    [groups, newGroupNameState.hasValue, newGroupNameState.value]
  )

  const handleGroupClick = useCallback(
    (id: string) => {
      if (selectedGroupIdState.value === id) {
        selectedGroupIdState.clear()
      } else {
        selectedGroupIdState.setValue(id)
      }
    },
    [selectedGroupIdState],
  )

  const handleNewGroupNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value

      newGroupNameState.setValue(name)
      selectedGroupIdState.clear()
    },
    [newGroupNameState, selectedGroupIdState],
  )

  const handleCreateGroupClick = useCallback(
    async () => {
      const newName = newGroupNameState.value.trim()
      if (newName) {
        const gid = await addGroup({ name: newGroupNameState.value })
        selectedGroupIdState.setValue(gid)
        await onOk(gid)

        toggleOnGroupsOpened()
      }
      newGroupNameState.clear()
    },
    [newGroupNameState, addGroup, selectedGroupIdState, onOk, toggleOnGroupsOpened],
  )

  const handleAddToGroupClick = useCallback(
    async () => {
      await onOk(selectedGroupIdState.value)
      newGroupNameState.clear()
    },
    [onOk, selectedGroupIdState.value, newGroupNameState]
  )

  const handleGroupInputEnterPress = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (isGroupExisted || selectedGroupIdState.hasValue) return
      event.preventDefault()

      handleCreateGroupClick()
    },
    [isGroupExisted, selectedGroupIdState.hasValue, handleCreateGroupClick],
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: classes.paper,
      }}
    >
      <Typography variant="h6" align="center" color="textSecondary">
        Add contact to
      </Typography>
      <BasicFormInput
        placeholder="New Group"
        onChange={handleNewGroupNameChange}
        onEnterPress={handleGroupInputEnterPress}
      />
      <div className={classes.label} onClick={toggleGroupsOpened} >
        Existing group
        {groupsOpened
          ? <Icon name={ICONS.ChevronDown} size="sm" />
          : <Icon name={ICONS.ChevronRight} size="sm" />
        }
      </div>
      <GroupMenu
        className={classes.groupMenu}
        selectedId={selectedGroupIdState.value}
        groupsOpened={groupsOpened}
        onClickGroup={handleGroupClick}
        theme="simple"
      />
      <div className={classes.buttonZone}>
        <Button onClick={onClose}>Cancel</Button>
        {isGroupExisted
          ? (
            <Button disabled>
              Group existed
            </Button>
          )
          : selectedGroupIdState.hasValue
            ? (
              <Button
                color="primary"
                onClick={handleAddToGroupClick}
              >
                Add to group
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={handleCreateGroupClick}
              >
                Create and add
              </Button>
            )
        }
      </div>
    </Dialog>
  )
})

export default AddContactToGroupForm
