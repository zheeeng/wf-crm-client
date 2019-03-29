import React, { useCallback, useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BasicFormInput from '~src/units/BasicFormInput'
import BasicFormInputSelect from '~src/units/BasicFormInputSelect'
import cssTips from '~src/utils/cssTips'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: Math.min(theme.breakpoints.values.sm, 388),
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
    ...cssTips(theme).horizontallySpaced(),
  },
}))

export interface CreateFormOption<F extends string> {
  title?: string,
  tip?: string,
  fields?: F[],
  enums?: {
    [key in F]?: string[]
  },
  okText?: string,
  cancelText?: string
}

export interface Props<F extends string> {
  open: boolean
  onClose?: React.ReactEventHandler<{}>
  onOk?: (o: object) => Promise<any>
  option?: CreateFormOption<F>
}

const CreateForm: React.FC<Props<any>> = React.memo(({ option, open, onClose, onOk }) => {
  const classes = useStyles({})

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
      }
    },
    [onOk],
  )

  const handleOkClick = useCallback(
    async () => {
      if (onOk) {
        await onOk(fieldValues.current)
      }
    },
    [onOk],
  )

  const { title = 'title', tip = '', fields = [], enums = {}, okText = 'Ok', cancelText = 'cancel' } = option || {}

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <Typography variant="h6" align="center" color="textSecondary">
          {title}
        </Typography>
        {tip && (
          <Typography variant="body2" align="center">
            {tip}
          </Typography>)
        }
        {fields.map(field => field in enums
          ? (
            <BasicFormInput
              key={field}
              placeholder={field}
              onChange={handleCreateInfoChange(field)}
              onEnterPress={handleEnterSubmit}
            />
          )
          : (
            null
            // <BasicFormInputSelect
            //   key={field}
            //   options={(enums[field] as string[])}
            //   placeholder={field}
            //   onChange={handleCreateInfoChange(field)}
            // />
          )
        )}
        <div className={classes.buttonZone}>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button color="primary" onClick={handleOkClick}>{okText}</Button>
        </div>
      </div>
    </Modal>
  )
})

export default CreateForm
