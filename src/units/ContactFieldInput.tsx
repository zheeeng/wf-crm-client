import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import cssTips from '~src/utils/cssTips'

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

export interface FieldSegmentValue { key: string, value: string, fieldType: string }

export interface FieldValue {
  values: FieldSegmentValue[]
  id?: string
}

export interface Props {
  Icon?: React.ComponentType<{ className?: string, color?: any }>,
  name: string,
  fieldValues: FieldValue[],
  backupFieldValue: FieldValue,
  expandable: boolean,
  hasTitle: boolean,
  editable?: boolean,
  onAddField (name: string, value: FieldSegmentValue): Promise<FieldValue | null>,
  onUpdateField (name: string, value: FieldSegmentValue, id: string): Promise<FieldValue | null>
  onDeleteField (id: string): void
}

const ContactFieldInput: React.FC<Props> = React.memo(
  ({ Icon, name, fieldValues, backupFieldValue,
     editable = false, hasTitle, expandable,
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
    async (segmentValue: FieldSegmentValue) => {
      const field = await onAddField(name, segmentValue)
    },
    [onAddField],
  )
  const updateField = useCallback(
    async (segmentValue: FieldSegmentValue, id: string) => {
      const field = await onUpdateField(name, segmentValue, id)
    },
    [onUpdateField],
  )

  const handleAddEntry = useCallback(
    () => { addField({ key: 'title', value: '', fieldType: name }) },
    [localFieldValues, name],
  )

  const handleEntryUpdateByBlur = useCallback(
    (key: string, index: number) =>
      (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value.trim()

        if (!value) return

        if (hasValues) {
          updateField({ key, value, fieldType: name }, localFieldValues[index].id!)
        } else {
          addField({ key, value, fieldType: name })
        }
      },
    [localFieldValues, name],
  )
  const handleEntryUpdateByKeydown = useCallback(
    (key: string, index: number) =>
      async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode !== 13) return
        const value = event.currentTarget.value.trim()
        event.currentTarget.value = ''

        if (!value) return

        if (hasValues) {
          updateField({ key, value, fieldType: name }, localFieldValues[index].id!)
        } else {
          addField({ key, value, fieldType: name })
        }
      },
    [localFieldValues, name],
  )

  const handleEntryDelete = useCallback(
    (index: number) => async () => {
      const localFieldValue = localFieldValues[index]

      await onDeleteField(localFieldValue.id!)
    },
    [localFieldValues],
  )

  return (
    <div className={classes.fieldBar}>
      {Icon && <Icon className={classes.fieldIcon} color="primary" />}
      <div className={classes.fieldTextWrapper}>
        {(hasValues ? localFieldValues : [backupFieldValue]).map((fieldValue, index, entries) => (
          <div className={classes.fieldTextBar} key={index}>
            {(hasTitle && !editable) && (
              <strong className={classes.fieldTypeText}>
                {fieldValue.values.find(sv => sv.key === 'title')!.value}
              </strong>
            )}
            {editable
              ? fieldValue.values.filter(
                segmentValue => segmentValue.key !== 'title',
              )
                .map(segmentValue => (
                  <Input
                    key={segmentValue.key}
                    className={classes.fieldInput}
                    placeholder={segmentValue.key}
                    defaultValue={segmentValue.value}
                    onBlur={handleEntryUpdateByBlur(segmentValue.value, index)}
                    onKeyDown={handleEntryUpdateByKeydown(segmentValue.value, index)}
                  />
                ),
              )
              : (
                <Input
                  disabled={true}
                  disableUnderline={true}
                  className={classes.fieldInput}
                  value={fieldValue.values.filter(sv => sv.key !== 'title').map(sv => sv.value).join(' ')}
                />
              )
            }
            {(hasTitle && editable) ? (
              <Input
                className={classes.fieldTypeText}
                value={fieldValue.values.find(sv => sv.key === 'title')!.value}
                onBlur={handleEntryUpdateByBlur('title', index)}
                onKeyDown={handleEntryUpdateByKeydown('title', index)}
                placeholder={'label'}
              />
            ) : undefined}
            {editable && (
              <div className={classes.filedIconBox}>
                {expandable && (index === entries.length - 1) &&  (
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
