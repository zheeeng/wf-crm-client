import React, { useCallback, useState, useContext, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BasicFormInput from '~src/units/BasicFormInput'
import cssTips from '~src/utils/cssTips'
import GroupMenu from '~src/components/GroupMenu'
import NotificationContainer from '~src/containers/Notification'
import useGroups from '~src/containers/useGroups'
import useToggle from '~src/hooks/useToggle'

import ChevronRight from '@material-ui/icons/ChevronRight'
import ExpandMore from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.breakpoints.values.xs,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    border: 'none',
    outline: '#efefef inset 1px',
  },
  buttonZone: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 4,
    ...cssTips(theme).horizontallySpaced,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    lineHeight: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
    padding: theme.spacing.unit,
    color: theme.palette.primary.main,
  },
}))

export interface Props {
  open: boolean,
  onClose?: React.ReactEventHandler<{}>
  onOk?: (groupId: string, isNew: boolean) => Promise<any>
}

const AddContactToGroupForm: React.FC<Props> = React.memo(({ open, onClose, onOk }) => {
  const { groups } = useGroups()
  const classes = useStyles({})

  const {
    value: groupsOpened,
    toggle: toggleGroupsOpened,
  } = useToggle(false)

  const onClickGroup = useCallback(
    (id: string) => {
      // console.log('clicked:', id)
    },
    [],
  )

  const groupOptions = useMemo(
    () => groups.map(group => ({ label: group.info.name, value: group.id })),
    [groups],
  )

  const { notify } = useContext(NotificationContainer.Context)

  const [groupName, setGroupName] = useState('')

  const fieldValues = useRef<{ [key: string]: string }>({})

  const handleOkClick = useCallback(
    async () => {
      if (onOk) {
        await onOk(groupName, false)
      }
      await notify(`Success create a new Contact: ${JSON.stringify(fieldValues.current)}`)
    },
    [groupName],
  )

  const handleEnterNewGroup = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const newGroup = event.currentTarget.value.trim()
      event.currentTarget.value = ''

      console.log(newGroup)
    },
    [],
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <Typography variant="subtitle1" align="center">
          Add contact to
        </Typography>
        <BasicFormInput
          placeholder="New Group"
          onEnterPress={handleEnterNewGroup}
        />
        <div className={classes.label} onClick={toggleGroupsOpened} >
          Existing group
          {groupsOpened
            ? <ExpandMore />
            : <ChevronRight />
          }
        </div>
        <GroupMenu
            groupsOpened={groupsOpened}
            onClickGroup={onClickGroup}
        />
        <div className={classes.buttonZone}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={handleOkClick}>Ok</Button>
        </div>
      </div>
    </Modal>
  )
})

export default AddContactToGroupForm
