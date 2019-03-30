import React, { useCallback, useState, useMemo, useRef } from 'react'
import classnames from 'classnames'
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
  paper2: {
    width: Math.min(theme.breakpoints.values.sm, 388) - theme.spacing.unit * 8,
  },
  buttonZone: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 4,
    ...cssTips(theme).horizontallySpaced(),
  },
  combinedFormRow: {
    display: 'flex',
  },
  formItem: {
    marginRight: theme.spacing.unit,
    ...{
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
}))

export type TextField = {
  type: 'text'
  name: string
  label: string
  required: boolean
}

export type CombinedTextField = {
  type: 'combinedText'
  keyName: string,
  nameAndLabels: Array<{
    name: string
    label: string
    required: boolean
    span: number
  }>
}

export type EnumTextField = {
  type: 'enumText'
  name: string
  label: string
  options: string[]
  required: boolean
}

export interface CreateFormOption {
  title?: string,
  tip?: string,
  fields: Array<TextField | CombinedTextField | EnumTextField>,
  okText?: string,
  cancelText?: string
}

export interface Props {
  open: boolean
  onClose?: React.ReactEventHandler<{}>
  onOk?: (o: object) => Promise<any>
  option?: CreateFormOption
  discardText?: string
}


const CreateForm: React.FC<Props> = React.memo(({ option, open, onClose, onOk, discardText }) => {
  const classes = useStyles({})

  const [cancelationConfirmModalOpen, setCancelationConfirmModalOpen] = useState(false)

  const openCancelationModal = useCallback(
    () => {
      setCancelationConfirmModalOpen(true)
    },
    [setCancelationConfirmModalOpen]
  )
  const closeCancelationModal = useCallback(
    () => {
      setCancelationConfirmModalOpen(false)
    },
    [setCancelationConfirmModalOpen]
  )

  const [toFillFields, setToFillFields] = useState<string[]>([])

  const fieldValues = useRef<{ [key: string]: string }>({})

  const handleCreateInfoChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      fieldValues.current[field] = e.target.value
    },
    [fieldValues],
  )
  const handleCreateInfoChange2 = useCallback(
    (field: string) => (value: string) => {
      fieldValues.current[field] = value
    },
    [fieldValues],
  )

  const handleClose = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {

      if (Object.keys(fieldValues.current).length > 0) {
        openCancelationModal()
      } else {
        onClose && onClose(e)
      }
    },
    [onClose, openCancelationModal]
  )

  const requiredFieldNames = useMemo(
    () => option
      ? option.fields.reduce(
        (acc, field) => {
          switch (field.type) {
            case 'text':
            case 'enumText':
              return [...acc, { name: field.name, required: field.required }]
            case 'combinedText':
              return [
                ...acc,
                ...field.nameAndLabels.map(p => ({ name: p.name, required: p.required })),
              ]
            default:
              return acc
          }
        },
        [] as Array<{ name: string, required: boolean }>
      ).filter(p => p.required).map(p => p.name)
      : [],
    [option],
  )

  const handleOkClick = useCallback(
    async () => {
      if (!onOk) return

      const values = fieldValues.current

      const noPassedFieldNames = requiredFieldNames.filter(
        name => !values[name]
      )

      if (noPassedFieldNames.length === 0) {
        await onOk(fieldValues.current)
      } else {
        setToFillFields(noPassedFieldNames)
      }
    },
    [onOk],
  )

  const { title = 'title', tip = '', fields = [], okText = 'Ok', cancelText = 'cancel' } = option || {}

  return (
    <>
      {discardText && (
        <Modal
          open={cancelationConfirmModalOpen}
        >
          <div className={classnames(classes.paper, classes.paper2)}>
            {discardText}
            <div className={classes.buttonZone}>
              <Button onClick={closeCancelationModal}>Continue Edit</Button>
              <Button color="primary" onClick={onClose}>Discard</Button>
            </div>
          </div>
        </Modal>
      )}
      <Modal
        open={open}
        onClose={handleClose}
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
          {fields.map(field => field.type == 'text'
            ? (
              <BasicFormInput
                error={toFillFields.includes(field.name)}
                key={field.name}
                placeholder={field.label}
                onChange={handleCreateInfoChange(field.name)}
              />
            )
            : field.type == 'combinedText'
            ? (
              <div
                key={field.keyName}
                className={classes.combinedFormRow}
              >
                {field.nameAndLabels.map(({ name, label, span }) => (
                  <BasicFormInput
                    error={toFillFields.includes(name)}
                    className={classes.formItem }
                    key={name}
                    placeholder={label}
                    onChange={handleCreateInfoChange(name)}
                    style={{ flex: span }}
                  />
                ))}
              </div>
            )
            : (
              <BasicFormInputSelect
                error={toFillFields.includes(field.name)}
                key={field.name}
                options={field.options.map(option => ({ label: option, value: option }))}
                placeholder={field.label}
                onChange={handleCreateInfoChange2(field.name)}
              />
            )
          )}
          <div className={classes.buttonZone}>
            <Button onClick={onClose}>{cancelText}</Button>
            <Button color="primary" onClick={handleOkClick}>{okText}</Button>
          </div>
        </div>
      </Modal>
    </>
  )
})

export default CreateForm
