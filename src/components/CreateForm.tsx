import React, { useCallback, useState, useMemo, useRef } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BasicFormInput from '~src/units/BasicFormInput'
import BasicFormInputSelect from '~src/units/BasicFormInputSelect'
import cssTips from '~src/utils/cssTips'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
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
  paper2: {
    width: 352,
  },
  tipText: {
    marginTop: theme.spacing.unit * 2,
  },
  dialogButtonZone: {
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

export type CountryField = {
  type: 'country'
  name: string
  label: string
  options: string[]
  required: boolean
}

export interface CreateFormOption {
  title?: string,
  tip?: string,
  fields: Array<TextField | CombinedTextField | EnumTextField | CountryField>,
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

  const [cancellationConfirmModalOpen, setCancellationConfirmModalOpen] = useState(false)

  const openCancellationModal = useCallback(
    () => {
      setCancellationConfirmModalOpen(true)
    },
    [setCancellationConfirmModalOpen]
  )
  const closeCancellationModal = useCallback(
    () => {
      setCancellationConfirmModalOpen(false)
    },
    [setCancellationConfirmModalOpen]
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
        openCancellationModal()
      } else {
        onClose && onClose(e)
      }
    },
    [onClose, openCancellationModal]
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
        <Dialog
          open={cancellationConfirmModalOpen}
          PaperProps={{
            className: classnames(classes.paper, classes.paper2),
          }}
        >
          {discardText}
          <div className={classes.dialogButtonZone}>
            <Button onClick={closeCancellationModal}>Continue Edit</Button>
            <Button color="primary" onClick={onClose}>Discard</Button>
          </div>
        </Dialog>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: classes.paper,
        }}
        scroll="body"
      >
        <Typography variant="h6" align="center" color="textSecondary">
          {title}
        </Typography>
        {tip && (
          <Typography variant="body2" align="center" color="textSecondary" className={classes.tipText}>
            {tip}
          </Typography>)
        }
        <form autoComplete="off">
          {fields.map(field => field.type == 'text'
            ? (
              <BasicFormInput
                error={toFillFields.includes(field.name)}
                key={field.name}
                placeholder={field.label}
                onChange={handleCreateInfoChange(field.name)}
              />
            )
            : field.type === 'combinedText'
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
        </form>
        <div className={classes.dialogButtonZone}>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button color="primary" onClick={handleOkClick}>{okText}</Button>
        </div>
      </Dialog>
    </>
  )
})

export default CreateForm
