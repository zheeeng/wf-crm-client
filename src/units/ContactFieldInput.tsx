import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import cssTips from '~src/utils/cssTips'
import pipe from 'ramda/es/pipe'
import head from 'ramda/es/head'

const useStyles = makeStyles((theme: Theme) => ({
  fieldBar: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 2,
  },
  fieldTextWrapper: {
    flexGrow: 1,
    paddingTop: theme.spacing.unit * 2,
  },
  fieldTextBar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
    ...cssTips(theme, { sizeFactor: 2 }).horizontallySpaced,
  },
  fieldIcon: {
    padding: theme.spacing.unit * 2.5,
    height: theme.spacing.unit * 8,
    width: theme.spacing.unit * 8,
    marginRight: theme.spacing.unit * 2.5,
  },
  filedIconBox: {
    width: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 4,
  },
  fieldAddIcon: {
    padding: theme.spacing.unit,
  },
  fieldTypeText: {
    width: 128,
    padding: '6px 0 7px',
  },
  fieldInput: {
    flexGrow: 1,
    padding: '6px 0 7px',
  },
  addTagIcon: {
    marginRight: theme.spacing.unit,
  },
}))

export interface FieldValue {
  value: string
  title: string
  id?: string
}

export interface Props {
  Icon?: React.ComponentType<{ className?: string, color?: any }>,
  name: string,
  fieldValues: FieldValue[],
  expandable: boolean,
  hasTitle: boolean,
  editable?: boolean,
  onAddField (name: string, value: FieldValue): Promise<FieldValue | null>,
  onUpdateField (name: string, value: FieldValue): Promise<FieldValue | null>
  onDeleteField (id: string): void
  placeholder?: string,
  titlePlaceholder?: string,
}

const ContactFieldInput: React.FC<Props> = React.memo(
  ({ Icon, name, fieldValues, editable = false, placeholder, titlePlaceholder, hasTitle, expandable,
     onAddField, onUpdateField, onDeleteField }) => {
  const classes = useStyles({})

  const [ localFieldValues, updateLocalFieldValues ] = useState(fieldValues)

  useEffect(
    () => updateLocalFieldValues(fieldValues),
    [fieldValues],
  )

  const hasValues = useMemo(
    () => !!fieldValues.length,
    [fieldValues],
  )

  const addField = useCallback(
    async (value: string, title: string) => {
      const field = await onAddField(
        name,
        { value, title },
      )

      console.log(field)
    },
    [onAddField],
  )
  const updateField = useCallback(
    async (value: string, title: string, id?: string) => {
      const field = await onUpdateField(
        name,
        { value, title, id },
      )

      console.log(field)
    },
    [onUpdateField],
  )

  const handleAddEntry = useCallback(
    () => {
      addField('', '')
    },
    [localFieldValues, name],
  )

  const handleEntryUpdateByBlur = useCallback(
    (type: 'changeValue' | 'changeTitle', index: number) => (event: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = event.target.value.trim()

      if (!inputValue) return

      const localFieldValue = localFieldValues[index]

      if (hasValues) {
        if (type === 'changeValue') {
          updateField(inputValue, localFieldValue.title, localFieldValue.id)
        } else {
          updateField(localFieldValue.value, inputValue, localFieldValue.id)
        }
      } else {
        if (type === 'changeValue') {
          addField(inputValue, localFieldValue.title)
        } else {
          addField(localFieldValue.value, inputValue)
        }
      }

    },
    [localFieldValues],
  )
  const handleEntryUpdateByKeydown = useCallback(
    (type: 'changeValue' | 'changeTitle', index: number) => async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== 13) return
      const inputValue = event.currentTarget.value.trim()
      event.currentTarget.value = ''

      if (!inputValue) return

      const localFieldValue = localFieldValues[index]

      if (hasValues) {
        if (type === 'changeValue') {
          updateField(inputValue, localFieldValue.title, localFieldValue.id)
        } else {
          updateField(localFieldValue.value, inputValue, localFieldValue.id)
        }
      } else {
        if (type === 'changeValue') {
          addField(inputValue, localFieldValue.title)
        } else {
          addField(localFieldValue.value, inputValue)
        }
      }
    },
    [localFieldValues],
  )
  const handleEntryDelete = useCallback(
    (index: number) => async () => {
      const localFieldValue = localFieldValues[index]

      await onDeleteField(localFieldValue.id || '')
    },
    [localFieldValues],
  )

  return (
    <div className={classes.fieldBar}>
      {Icon && <Icon className={classes.fieldIcon} color="primary" />}
      <div className={classes.fieldTextWrapper}>
        {(hasValues ? localFieldValues : [{ value: '', title: '' }]).map((pair, index) => (
          <div className={classes.fieldTextBar} key={index}>
            <Input
              disabled={!editable}
              disableUnderline={!editable}
              className={classes.fieldInput}
              placeholder={placeholder}
              defaultValue={pair.value}
              onBlur={handleEntryUpdateByBlur('changeValue', index)}
              onKeyDown={handleEntryUpdateByKeydown('changeValue', index)}
              startAdornment={
                (!hasTitle || editable)
                  ? undefined
                  : <strong className={classes.fieldTypeText}>{pair.title}</strong>
              }
            />
            {(hasTitle && editable) ? (
              <Input
                className={classes.fieldTypeText}
                value={pair.title}
                onBlur={handleEntryUpdateByBlur('changeTitle', index)}
                onKeyDown={handleEntryUpdateByKeydown('changeTitle', index)}
                placeholder={titlePlaceholder}
              />
            ) : undefined}
            {editable && (
              <div className={classes.filedIconBox}>
                {expandable && (
                  <IconButton className={classes.fieldAddIcon} onClick={handleAddEntry}>
                    <AddCircle color="primary" />
                  </IconButton>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

export default ContactFieldInput
