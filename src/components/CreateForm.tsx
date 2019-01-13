import React, { useCallback, useContext, useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BasicFormInput from '~src/units/BasicFormInput'
import cssTips from '~src/utils/cssTips'
import NotificationContainer from '~src/containers/Notification'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.breakpoints.values.sm,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    border: 'none',
    outline: '#efefef inset 1px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  buttonZone: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 4,
    ...cssTips(theme).horizontallySpaced,
  },
}))

export interface CreateFormOption<F extends string> {
  title?: string,
  tip?: string,
  fields?: F[],
  okText?: string,
  cancelText?: string
}

export interface Props {
  open: boolean
  onClose?: React.ReactEventHandler<{}>
  onOk?: (o: object) => Promise<any>
  option?: CreateFormOption<any>
}

const CreateForm: React.FC<Props> = React.memo(({ option, open, onClose, onOk }) => {
  const classes = useStyles({})

  const { notify } = useContext(NotificationContainer.Context)

  const fieldValues = useRef<{ [key: string]: string }>({})

  const handleCreateInfoChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      fieldValues.current[field] = e.target.value
    },
    [fieldValues],
  )

  const handleEnterSubmit = useCallback(
    async () => {
      if (onOk && Object.keys(fieldValues.current).length === 1) {
        await onOk(fieldValues.current)
        await notify(`Success create: ${JSON.stringify(fieldValues.current)}`)
      }
    },
    [onOk],
  )

  const handleOkClick = useCallback(
    async () => {
      if (onOk) {
        await onOk(fieldValues.current)
        await notify(`Success create: ${JSON.stringify(fieldValues.current)}`)
      }
    },
    [onOk],
  )

  const { title = 'title', tip = '', fields = [], okText = 'Ok', cancelText = 'cancel' } = option || {}

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <Typography variant="subtitle1" align="center">
          {title}
        </Typography>
        {tip && (
          <Typography variant="body2" align="center">
            {tip}
          </Typography>)
        }
        {fields.map(field => (
          <BasicFormInput
            key={field}
            placeholder={field}
            onChange={handleCreateInfoChange(field)}
            onEnterPress={handleEnterSubmit}
          />
        ))}
        <div className={classes.buttonZone}>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button color="primary" onClick={handleOkClick}>{okText}</Button>
        </div>
      </div>
    </Modal>
  )
})

export default CreateForm
