import React, { useCallback, useState, useMemo, useEffect } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import Eye from '@material-ui/icons/RemoveRedEye'
import Reorder from '@material-ui/icons/Reorder'

import cssTips from '~src/utils/cssTips'

const useStyles = makeStyles((theme: Theme) => ({
  hidden: {
    display: 'none',
  },
  disabled: {
    'cursor': 'not-allowed',
    '& *': {
      cursor: 'not-allowed',
    },
  },
  fieldBar: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 2,
  },
  fieldTextWrapper: {
    flex: 1,
    paddingTop: theme.spacing.unit * 2,
  },
  fieldTextBarWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldTextBar: {
    flex: 1,
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
    display: 'flex',
    margin: 0,
  },
  fieldControlIcon: {
    margin: theme.spacing.unit,
    marginRight: 0,
    padding: 0,
  },
  fieldHoverShowingIcon: {
    'visibility': 'hidden',
    '$fieldTextBarWrapper:hover &': {
      visibility: 'visible',
    },
  },
  fieldTypeText: {
    flex: 0.5,
    padding: '6px 0 7px',
  },
  fieldInput: {
    flex: 1,
    padding: '6px 0 7px',
  },
  addTagIcon: {
    marginRight: theme.spacing.unit,
  },
}))

export interface FieldSegmentValue { key: string, value: string, fieldType: string }

const getEmptyFieldSegmentValue = (fieldType: string): FieldSegmentValue => ({
  key: 'title',
  value: '',
  fieldType,
})

export interface FieldValue {
  values: FieldSegmentValue[]
  id?: string
  priority: number
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
  onDeleteField (name: string, id: string): Promise<string | null>
  onToggleHideField (name: string, priority: number, id: string): Promise<FieldValue | null>
}

const ContactFieldInput: React.FC<Props> = React.memo(
  ({ Icon, name, fieldValues, backupFieldValue,
     editable = false, hasTitle, expandable,
     onAddField, onUpdateField, onDeleteField, onToggleHideField }) => {

  const classes = useStyles({})

  const [ localFieldValues, updateLocalFieldValues ] = useState(fieldValues)

  useEffect(
    () => updateLocalFieldValues(fieldValues),
    [fieldValues],
  )

  const hasValues = useMemo(
    () => !!fieldValues.length || !!localFieldValues.length,
    [fieldValues, localFieldValues],
  )

  const addField = useCallback(
    async (segmentValue: FieldSegmentValue) => {
      const field = await onAddField(name, segmentValue)
      if (field) updateLocalFieldValues(values => values.concat(field))
    },
    [onAddField, name],
  )
  const updateField = useCallback(
    async (segmentValue: FieldSegmentValue, id: string) => {
      if (!id) return
      const field = await onUpdateField(name, segmentValue, id)
      if (field) updateLocalFieldValues(values => values.map(v => v.id === id ? field : v))
    },
    [onUpdateField, name],
  )
  const removeField = useCallback(
    async (id: string) => {
      if (!id) return
      const removedId = await onDeleteField(name, id)
      if (removedId) updateLocalFieldValues(values => values.filter(v => v.id !== removedId))
    },
    [onDeleteField, name],
  )
  const toggleHideField = useCallback(
    async (id: string) => {
      const priority = localFieldValues.find(v => v.id === id)!.priority
      const newPriority = priority !== 0
        ? 0
        : Math.max(
            Math.min.apply(
              null,
              localFieldValues.map(v => v.priority).filter(p => typeof p !== 'undefined'),
            ) - 1,
            1,
          )
      const field = await onToggleHideField(name, newPriority, id)
      if (field) {
        updateLocalFieldValues(values => values
          .map(v => v.id === id ? field : v)
          .sort((p, c) => c.priority - p.priority),
        )
      }
    },
    [onUpdateField, name, localFieldValues],
  )

  const handleAddEntry = useCallback(
    () => { addField(getEmptyFieldSegmentValue(name)) },
    [localFieldValues, name],
  )

  const handleEntryUpdateByBlur = useCallback(
    (key: string, id: string) =>
      (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value.trim()

        if (!value) return

        if (hasValues) {
          updateField({ key, value, fieldType: name }, id)
        } else {
          addField({ key, value, fieldType: name })
        }
      },
    [localFieldValues, name],
  )
  const handleEntryUpdateByKeydown = useCallback(
    (key: string, id: string) =>
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode !== 13) return
        const value = event.currentTarget.value.trim()

        if (!value) return

        if (hasValues) {
          updateField({ key, value, fieldType: name }, id)
        } else {
          addField({ key, value, fieldType: name })
        }
      },
    [localFieldValues, name],
  )

  const handleEntryDelete = useCallback(
    (id: string) => () => removeField(id),
    [localFieldValues],
  )
  const handleEntryToggleHide = useCallback(
    (id: string) => () => toggleHideField(id),
    [localFieldValues],
  )

  return (
    <div className={classes.fieldBar}>
      {Icon && <Icon className={classes.fieldIcon} color="primary" />}
      <div className={classes.fieldTextWrapper}>
        {(hasValues ? localFieldValues : [backupFieldValue]).map((fieldValue, index) => (
          <div
            className={classnames(
              classes.fieldTextBarWrapper,
              !editable && fieldValue.priority === 0 && classes.hidden,
            )}
            key={fieldValue.id}
          >
            <div className={classnames(
              classes.fieldTextBar,
              editable && fieldValue.priority === 0 && classes.disabled,
            )}>
              {(hasTitle && !editable) && (
                <Typography variant="subtitle1" className={classes.fieldTypeText}>
                  {fieldValue.values.find(sv => sv.key === 'title')!.value}
                </Typography>
              )}
              {editable
                ? (
                  <>
                    {fieldValue.values.filter(segmentValue => segmentValue.key !== 'title')
                      .map(segmentValue => (
                        <Input
                          key={segmentValue.key}
                          className={classes.fieldInput}
                          placeholder={segmentValue.key}
                          defaultValue={segmentValue.value}
                          onBlur={handleEntryUpdateByBlur(segmentValue.key, fieldValue.id!)}
                          onKeyDown={handleEntryUpdateByKeydown(segmentValue.key, fieldValue.id!)}
                          disabled={fieldValue.priority === 0}
                        />
                      ))
                    }
                    {hasTitle ? (
                      <Input
                        className={classes.fieldTypeText}
                        defaultValue={fieldValue.values.find(sv => sv.key === 'title')!.value}
                        onBlur={handleEntryUpdateByBlur('title', fieldValue.id!)}
                        onKeyDown={handleEntryUpdateByKeydown('title', fieldValue.id!)}
                        placeholder={'label'}
                        disabled={fieldValue.priority === 0}
                      />
                    ) : undefined}
                </>
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
            </div>
            {editable && (
              <div className={classes.filedIconBox}>
                <IconButton
                  className={classnames(classes.fieldControlIcon, classes.fieldHoverShowingIcon)}
                  onClick={handleEntryToggleHide(fieldValue.id!)}
                >
                  <Eye color={fieldValue.priority === 0 ? 'primary' : 'disabled'} />
                </IconButton>
                <IconButton
                  className={classnames(classes.fieldControlIcon, classes.fieldHoverShowingIcon)}
                >
                  <Reorder color="disabled" />
                </IconButton>
                {expandable && (index === 0
                  ? (
                    <IconButton className={classes.fieldControlIcon} onClick={handleAddEntry}>
                      <AddCircle color="primary" />
                    </IconButton>
                  )
                  : (
                    <IconButton className={classes.fieldControlIcon} onClick={handleEntryDelete(fieldValue.id!)}>
                      <RemoveCircle color="disabled" />
                    </IconButton>
                  )
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
