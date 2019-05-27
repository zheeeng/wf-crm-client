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
import useToggle from '~src/hooks/useToggle'

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
  paper2: {
    width: 352,
  },
  dialogButtonZone: {
    textAlign: 'right',
    marginTop: theme.spacing(4),
    ...cssTips(theme).horizontallySpaced(),
  },
  combinedFormRow: {
    display: 'flex',
  },
  formItem: {
    marginRight: theme.spacing(1),
    ...{
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
  text: {
    marginTop: theme.spacing(2),
  },
  textAlignFixed: {
    padding: theme.spacing(0, 6),
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
    isNumber?: boolean,
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

export type OkColor = 'inherit' | 'primary' | 'secondary' | 'default' | undefined

export interface CreateFormOption {
  title?: string,
  tip?: string,
  fields: Array<TextField | CombinedTextField | EnumTextField | CountryField>,
  okTextWatch?: string,
  okText?: string | ((text: string) => string),
  okColor?: OkColor | ((text: string) => OkColor),
  cancelText?: string,
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

  const {
    title = 'title', tip = '', fields = [],
    okTextWatch = '', okColor = 'primary', okText = 'Ok', cancelText = 'cancel',
  } = option || {}

  const {
    value: cancellationConfirmModalOpen,
    toggleOn: openCancellationModal,
    toggleOff: closeCancellationModal,
  } = useToggle(false)

  const [toFillFields, setToFillFields] = useState<string[]>([])

  const fieldValues = useRef<{ [key: string]: string }>({})

  const [watchValue, setWatchValue] = useState(fieldValues.current[okTextWatch] || '')

  const handleCreateInfoChange = useCallback(
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      fieldValues.current[field] = value
      if (field === okTextWatch) {
        setWatchValue(value)
      }
    },
    [fieldValues, setWatchValue],
  )

  const handleCreateInfoChange2 = useCallback(
    (field: string) => (value: string) => {
      fieldValues.current[field] = value
      if (field === okTextWatch) {
        setWatchValue(value)
      }
    },
    [fieldValues, watchValue],
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

  const forceClose = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      closeCancellationModal()
      onClose && onClose(e)
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

  const handleCreateInfoSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

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

  return (
    <>
      {discardText && (
        <Dialog
          open={cancellationConfirmModalOpen}
          PaperProps={{
            className: classnames(classes.paper, classes.paper2),
          }}
        >
          <Typography variant="body2" color="textSecondary">{discardText}</Typography>
          <div className={classes.dialogButtonZone}>
            <Button onClick={closeCancellationModal}>Continue editing</Button>
            <Button color="primary" onClick={forceClose}>Discard</Button>
          </div>
        </Dialog>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: classes.paper,
        }}
        scroll={fields.length > 5 ? 'body' : 'paper'}
      >
        <Typography variant="h6" align="center" color="textSecondary">
          {title}
        </Typography>
        {tip && (
          <Typography
            variant="body2"
            color="textSecondary"
            className={classnames(classes.text, classes.textAlignFixed)}
          >
            {tip}
          </Typography>)
        }
        {fields.map((field, index) => field.type === 'text'
          ? (
            <BasicFormInput
              autoFocus={index === 0}
              error={toFillFields.includes(field.name)}
              key={field.name}
              placeholder={field.label}
              onChange={handleCreateInfoChange(field.name)}
              onEnterPress={handleCreateInfoSubmit}
            />
          )
          : field.type === 'combinedText'
          ? (
            <div
              key={field.keyName}
              className={classes.combinedFormRow}
            >
              {field.nameAndLabels.map(({ name, label, span, isNumber }) => (
                <BasicFormInput
                  type={isNumber ? 'number' : 'text'}
                  error={toFillFields.includes(name)}
                  className={classes.formItem }
                  key={name}
                  placeholder={label}
                  onChange={handleCreateInfoChange(name)}
                  onEnterPress={handleCreateInfoSubmit}
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
        <div className={classes.dialogButtonZone}>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button
            disabled={typeof okColor === 'function' && okColor(watchValue) === 'default' ? true : false}
            color={typeof okColor === 'function' ? okColor(watchValue) : okColor}
            onClick={handleCreateInfoSubmit}
          >
            {typeof okText === 'function' ? okText(watchValue) : okText}
          </Button>
        </div>
      </Dialog>
    </>
  )
})

export default CreateForm
