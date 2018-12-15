import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BasicFormInput from '~src/units/BasicFormInput'
import cssTips from '~src/utils/cssTips'
import notificationStore from '~src/services/notification'
import { ContactAPI } from '~src/types/Contact'

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

export interface CreateFormOption<F extends string> {
  title?: string,
  fields?: F[],
  okText?: string,
  cancelText?: string
}

export interface Props {
  open: boolean
  onClose?: React.ReactEventHandler<{}>
  onOk?: <O extends object>(o: O) => Promise<any>
  option?: CreateFormOption<keyof ContactAPI>
}

const CreateForm: React.FC<Props> = React.memo(({ option, open, onClose, onOk }) => {
  const classes = useStyles({})

  const notificationContext = React.useContext(notificationStore.Context)

  const fieldValues = React.useRef<{ [key: string]: string }>({})

  const handleCreateInfoChange = React.useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      fieldValues.current[field] = e.target.value
    },
    [fieldValues],
  )

  const handleOkClick = React.useCallback(
    () => {
      (onOk ? onOk(fieldValues.current) : Promise.resolve()).then(() => {
        notificationContext.handleOpen(`Success create a new Contact: ${JSON.stringify(fieldValues.current)}`)
      })
    },
    [],
  )

  const { title = 'title', fields = [], okText = 'Ok', cancelText = 'cancel' } = option || {}

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <Typography variant="subtitle1" align="center">
          {title}
        </Typography>
        {fields.map(field => (
          <BasicFormInput
            key={field}
            placeholder={field}
            onChange={handleCreateInfoChange(field)}
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
