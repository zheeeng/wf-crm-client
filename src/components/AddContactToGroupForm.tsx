import React, { useCallback, useState, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import BasicFormInput from '~src/units/BasicFormInput'
import cssTips from '~src/utils/cssTips'
import GroupMenu from '~src/components/GroupMenu'
import AlertContainer from '~src/containers/Alert'
import GroupsContainer from '~src/containers/Groups'
import useToggle from '~src/hooks/useToggle'

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
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    lineHeight: `${theme.spacing(4)}px`,
    height: theme.spacing(4),
    padding: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}))

export interface Props {
  open: boolean,
  onClose?: React.ReactEventHandler<{}>
  onOk?: (groupId: string) => Promise<any>
}

const AddContactToGroupForm: React.FC<Props> = React.memo(({ open, onClose, onOk }) => {
  const { fail } = useContext(AlertContainer.Context)
  const { addGroup, addGroupError, groups } = useContext(GroupsContainer.Context)
  const classes = useStyles({})

  useEffect(
    () => {
      addGroupError && fail(<><Icon name={ICONS.CheckCircle} /> Add group failed</>)
    },
    [addGroupError],
  )

  const [ newGroupName, setNewGroupName ] = useState('')
  const [ selectedGroupId, setSelectedGroupId ] = useState('')

  const {
    value: groupsOpened,
    toggle: toggleGroupsOpened,
    toggleOn: toggleOnGroupsOpened,
  } = useToggle(true)

  const handleGroupClick = useCallback(
    (id: string) => {
      if (selectedGroupId === id) {
        setSelectedGroupId('')
      } else {
        setSelectedGroupId(id)
      }
    },
    [selectedGroupId],
  )

  const handleNewGroupNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value

      setNewGroupName(name)
    },
    [setNewGroupName],
  )

  const handleCreateGroupClick = useCallback(
    async () => {
      const newName = newGroupName.trim()
      if (newName) {
        await addGroup({ name: newGroupName })
        toggleOnGroupsOpened()
      }
      setNewGroupName('')
    },
    [newGroupName],
  )

  const handleOkClick = useCallback(
    async () => {
      onOk && onOk(selectedGroupId)
    },
    [selectedGroupId],
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
      />
      <div className={classes.label} onClick={toggleGroupsOpened} >
        Existing group
        {groupsOpened
          ? <Icon name={ICONS.ChevronDown} />
          : <Icon name={ICONS.ChevronRight} />
        }
      </div>
      <GroupMenu
        className={classes.groupMenu}
        selectedId={selectedGroupId}
        groupsOpened={groupsOpened}
        onClickGroup={handleGroupClick}
      />
      <div className={classes.buttonZone}>
        <Button onClick={onClose}>Cancel</Button>
        {newGroupName
          ? (groups.some(group => group.info.name == newGroupName)
            ? (
              <Button disabled>
                Group existed
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={handleCreateGroupClick}
              >
                Create and add
              </Button>
            )
          )
          : (
            <Button
              color="primary"
              onClick={handleOkClick}
              disabled={!selectedGroupId}
            >
              Ok
            </Button>)
        }
      </div>
    </Dialog>
  )
})

export default AddContactToGroupForm
