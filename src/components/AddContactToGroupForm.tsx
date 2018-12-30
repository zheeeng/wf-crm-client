import React, { useCallback, useContext, useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BasicFormInput from '~src/units/BasicFormInput'
import cssTips from '~src/utils/cssTips'
import NotificationContainer from '~src/containers/Notification'
import useGroups from '~src/containers/useGroups'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.spacing.unit * 50,
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
}))

export interface Props {
  onClose?: React.ReactEventHandler<{}>
  onOk?: (groupId: string, isNew: boolean) => Promise<any>
}

const AddContactToGroupForm: React.FC<Props> = React.memo(({ onClose, onOk }) => {
  const { groups } = useGroups()
  const classes = useStyles({})

  const { notify } = useContext(NotificationContainer.Context)

  const fieldValues = useRef<{ [key: string]: string }>({})

  const handleCreateInfoChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      fieldValues.current[field] = e.target.value
    },
    [fieldValues],
  )

  const handleOkClick = useCallback(
    () => {
      // (onOk ? onOk(fieldValues.current) : Promise.resolve()).then(() => {
      //   notify(`Success create a new Contact: ${JSON.stringify(fieldValues.current)}`)
      // })
    },
    [],
  )

  return (
    <Modal
      open={true}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <Typography variant="subtitle1" align="center">
          Add contact to
        </Typography>
        {/* {fields.map(field => (
          <BasicFormInput
            key={field}
            placeholder={field}
            onChange={handleCreateInfoChange(field)}
          />
        ))} */}
        <div className={classes.buttonZone}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={handleOkClick}>Add</Button>
        </div>
      </div>
    </Modal>
  )
})

export default AddContactToGroupForm
