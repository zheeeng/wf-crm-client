import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { useInput } from 'react-hanger'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Select from 'react-select'
import { components } from '~src/units/BasicFormInputSelect'
import BasicDateInput from '~src/units/BasicDateInput'
import SortableList, { SortHandler } from '~src/units/SortableList'
import arrayMove from 'array-move'
import cssTips from '~src/utils/cssTips'
import { isEmail, isValidDate } from '~src/utils/validation'
import camelToWords from '~src/utils/camelToWords'
import SvgIcon, { ICONS } from '~src/units/Icons'

const joinSegmentFieldValues = (values: FieldSegmentValue[]) =>  {
  if (values[0].fieldType === 'date') {
    const dateField = [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      values.find(v => v.key === 'month')!.value.padStart(2, '0'),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      values.find(v => v.key === 'day')!.value.padStart(2, '0'),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      values.find(v => v.key === 'year')!.value.padStart(4, '0'),
    ].join('/').trim()

    return dateField !== '00/00/0000' ? dateField : ''
  }

  return values
    .filter(value => value.key !== 'title')
    .map(value => value.value)
    .join(' ').trim()
}

const useStyles = makeStyles((theme: Theme) => ({
  toolTip: {
    marginTop: theme.spacing(-1),
    marginLeft: theme.spacing(-2),
  },
  hidden: {
    '&&': {
      display: 'none',
    },
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.3,
  },
  breaker: {
    width: '100%',
  },
  takePlace: {
    '&&': {
      visibility: 'hidden',
      pointerEvents: 'none',
    },
  },
  fieldBar: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  fieldSimpleBar: {
    marginBottom: 0,
  },
  fieldNameWrapper: {
  },
  fieldTextWrapper: {
    flexGrow: 1,
    flexBasis: '100%',
    paddingTop: theme.spacing(1),
  },
  isSorting: {
  },
  fieldTextBarWrapper: {
    ...cssTips(theme).centerFlex('space-between'),
    flexDirection: 'column',
    padding: theme.spacing(0, 1),
  },
  isSortingTarget: {},
  fieldTextBar: {
    ...cssTips(theme).casFlex('row'),
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    ...cssTips(theme, { sizeFactor: 2 }).horizontallySpaced(),
  },
  fieldName: {
    padding: theme.spacing(2.5),
    height: theme.spacing(8),
    width: theme.spacing(16),
    marginRight: theme.spacing(2.5),
    textAlign: 'left',
  },
  fieldIcon: {
    padding: theme.spacing(2.5),
    height: theme.spacing(8),
    width: theme.spacing(8),
    marginRight: theme.spacing(2.5),
  },
  filedIconBox: {
    display: 'flex',
    margin: 0,
  },
  fieldControlIcon: {
    margin: theme.spacing(1),
    marginRight: 0,
    padding: 0,
  },
  placeholderIcon: {
    visibility: 'hidden',
  },
  fieldHoverShowingIcon: {
    visibility: 'hidden',
    '$fieldTextBarWrapper:hover &': {
      visibility: 'visible',
    },
    '$isSorting &&': {
      visibility: 'hidden',
    },
    '$isSortingTarget:hover &': {
      visibility: 'visible',
    },
  },
  fieldDragIcon: {
    cursor: 'move',
  },
  fieldTypeText: {
    flex: 0.5,
    padding: theme.spacing(1, 0, 0, 0),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    marginTop: 0,
    marginBottom: 0,
  },
  fieldLabelText: {
    lineHeight: '1.1875em',
    padding: '10px 0 16px 0',
    textAlign: 'left',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  takeQuarter: {
    flex: 0.25,
  },
  fieldTitle: {
    display: 'flex',
  },
  fieldTitleIcon: {
    paddingLeft: 0,
    marginRight: 0,
  },
  fieldTitleName: {
    paddingLeft: 0,
  },
  input: {
    "&[type='number']": {
      '-moz-appearance': 'textfield',
    },
    "&::-webkit-outer-spin-button": {
      '-webkit-appearance': 'none',
    },
    "&::-webkit-inner-spin-button": {
      '-webkit-appearance': 'none',
    },
  },
  fieldInput: {
    flexGrow: 1,
    flexBasis: '100%',
    padding: theme.spacing(1, 0),
    color: theme.palette.text.secondary,
  },
  fieldDisplayText: {
    fontSize: 14,
    lineHeight: '1.875em',
    padding: '10px 0 16px 0',
    color: theme.palette.text.secondary,
    fontWeight: 600,
  },
  fieldSimpleDisplayText: {
    fontWeight: 500,
  },
  addTagIcon: {
    marginRight: theme.spacing(1),
  },
  dragged: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 0px 4px 0px rgba(163,174,173,0.5)',
  },
  showInDragged: {
    '$dragged &&': {
      visibility: 'visible',
    },
  },
  hiddenInDragged: {
    '$dragged &&': {
      visibility: 'hidden',
    },
  },
  fieldDisabled: {
    cursor: 'not-allowed',
  },
}))

export interface FieldSegmentValue { key: string, value: string, fieldType: string }

const getEmptyFieldSegmentValue = (fieldType: string): FieldSegmentValue => ({
  key: 'title',
  value: '',
  fieldType,
})

const getFieldDefaultTitle = (fieldValue: FieldValue) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  fieldValue.values.find(sv => sv.key === 'title')!.value

const getFieldDefaultTitleWidthDec = (fieldValue: FieldValue) => {
  const defaultTitle = getFieldDefaultTitle(fieldValue).trim()
  if (defaultTitle) {
    return '• ' + defaultTitle
  }

  return
}

const getLabelExample = (fieldType?: string) => {
  switch (fieldType) {
    case 'calendar':
      return 'label: e.g. Birthday'
    case 'email':
      return 'label: e.g. Person'
    case 'number':
      return 'label: e.g. Person'
    case 'address':
      return 'label: e.g. Home'
    default:
      return 'label'
  }
}
export interface FieldValue {
  values: FieldSegmentValue[]
  appendValues?: FieldSegmentValue[]
  id?: string
  priority: number
  waiver?: any
}

export type InputProps = {
  fieldName?: string
  showName?: boolean
  Icon?: React.ComponentType<{ className?: string, color?: any }>
  name: string
  hasTitle: boolean
  editable?: boolean
  type?: string
}

export type Props = InputProps & {
  fieldValues: FieldValue[]
  backupFieldValue: FieldValue
  expandable: boolean
  onAddField (name: string, value: FieldSegmentValue, priority: number): Promise<FieldValue | null>
  onUpdateField (name: string, value: FieldSegmentValue, id: string,  priority: number): Promise<FieldValue | null>
  onBatchUpdateFields(name: string, updateObj: any, id: string, priority: number): Promise<FieldValue | null>
  onUpdateDateField?: (date: { year: number, month: number, day: number }, id: string,  priority: number) => Promise<FieldValue | null>
  onAddDateField?: (date: { year: number, month: number, day: number }, priority: number) => Promise<FieldValue | null>
  onDeleteField (name: string, id: string): Promise<string | null>
  onChangePriority (name: string, id: string, priority: number): Promise<FieldValue | null>
}

const getFieldDate = (values: FieldSegmentValue[]) => {
  const year = values.find(v => v.key === 'year')
  const month = values.find(v => v.key === 'month')
  const day = values.find(v => v.key === 'day')
  if (!year || !month || !day) return null
  if (!isValidDate(+day.value, +month.value, +year.value)) return null

  const d = new Date()
  d.setFullYear(+year.value)
  d.setMonth(+month.value - 1)
  d.setDate(+day.value)
  return d
}

const ContactFieldInput: React.FC<Props> = React.memo(
  ({ fieldName = '', showName = false, Icon, name, fieldValues, backupFieldValue,
    editable = false, type, hasTitle, expandable,
    onAddField, onUpdateField, onBatchUpdateFields, onUpdateDateField, onAddDateField, onDeleteField, onChangePriority,
  }) => {

    const classes = useStyles({})

    const [ localFieldValues, setLocalFieldValues ] = useState(fieldValues)

    useEffect(
      () => setLocalFieldValues(fieldValues),
      [fieldValues],
    )

    const containerRef = useRef<HTMLDivElement>(null)

    const hasValues = useMemo(
      () => !!fieldValues.length || !!localFieldValues.length,
      [fieldValues, localFieldValues],
    )

    const addHiddenField = useCallback(
      async () => {
        const field = await onAddField(name, getEmptyFieldSegmentValue(name), 0)
        if (field) setLocalFieldValues(values => values.concat(field))
        return field
      },
      [onAddField, name, setLocalFieldValues],
    )

    const addField = useCallback(
      async (segmentValue: FieldSegmentValue) => {
        const newPriority = ((localFieldValues[0] || {}).priority || 80) + 1
        const field = await onAddField(name, segmentValue, newPriority)
        if (field) setLocalFieldValues(values => values.concat(field))
        return field
      },
      [localFieldValues, onAddField, name, setLocalFieldValues],
    )
    const updateField = useCallback(
      async (segmentValue: FieldSegmentValue, id: string) => {
        if (!id) return
        const fieldValue = localFieldValues.find(value => value.id === id)
        if (!fieldValue) return
        const priority = fieldValue.priority

        const field = await onUpdateField(name, segmentValue, id, priority)
        if (field) setLocalFieldValues(values => values.map(v => v.id === id ? field : v))
        return field
      },
      [localFieldValues, onUpdateField, name, setLocalFieldValues],
    )

    const addDateField = useCallback(
      async (year: number, month: number, day: number) => {
        if (!onAddDateField) return
        const newPriority = ((localFieldValues[0] || {}).priority || 80) + 1
        const field = await onAddDateField({ year, month, day }, newPriority)
        if (field) setLocalFieldValues(values => values.concat(field))
        return field
      },
      [localFieldValues, onAddDateField, setLocalFieldValues],
    )
    const updateDateField = useCallback(
      async (year: number, month: number, day: number, id: string) => {
        if (!onUpdateDateField) return
        if (!id) return
        const fieldValue = localFieldValues.find(value => value.id === id)
        if (!fieldValue) return
        const priority = fieldValue.priority

        const field = await onUpdateDateField({ year, month, day }, id, priority)
        if (field) setLocalFieldValues(values => values.map(v => v.id === id ? field : v))
      },
      [localFieldValues, onUpdateDateField, setLocalFieldValues]
    )
    const removeField = useCallback(
      async (id: string) => {
        if (!id) return
        const removedId = await onDeleteField(name, id)

        if (removedId) setLocalFieldValues(values => values.filter(v => v.id !== removedId))
      },
      [onDeleteField, name, setLocalFieldValues],
    )
    const toggleHideField = useCallback(
      async (id: string) => {
        if (!id) {
          await addHiddenField()
          return
        }

        const targetField = localFieldValues.find(v => v.id === id)

        if (!targetField) return

        const newPriority = targetField.priority !== 0
          ? 0
          : Math.max(
            Math.min.apply(
              null,
              localFieldValues.map(v => v.priority).filter(p => typeof p !== 'undefined'),
            ) - 1,
            1,
          )
        const field = await onChangePriority(name, id, newPriority)
        if (field) {
          setLocalFieldValues(
            values => values
              .map(v => v.id === id ? field : v)
              .sort((p, c) => c.priority - p.priority),
          )
        }
      },
      [localFieldValues, onChangePriority, name, addHiddenField],
    )

    const handleAddEntry = useCallback(
      () => {
        addField(getEmptyFieldSegmentValue(name))
        // if there a stub field, the first time addField will create a real replacement for the stub filed, we need addField again for create another new field
        if (!hasValues) {
          addField(getEmptyFieldSegmentValue(name))
        }
      },
      [addField, name, hasValues],
    )

    const [hasErrorKeys, setHasErrorKeys] = useState<string[]>([])

    const queueRef = useRef({ queue: [] as FieldSegmentValue[], isAdding: false })

    const batchUpdateFields = useCallback(
      async (fields: FieldSegmentValue[], id: string, priority: number) => {
        const fieldType = fields[0].fieldType
        const updateObj = fields.reduce(
          (acc: any, field) => {
            acc[field.key] = field.value
            return acc
          },
          {},
        )

        const field = await onBatchUpdateFields(fieldType, updateObj, id, priority)

        if (field) setLocalFieldValues(values => values.map(v => v.id === id ? field : v))
      },
      [onBatchUpdateFields],
    )

    const handleEntryUpdateByBlur = useCallback(
      (key: string, id: string, defaultValue: string) =>
        async (event: React.FocusEvent<HTMLInputElement>) => {
          const value = event.target.value.trim()

          if (!value || value === defaultValue) return

          if (key !== 'title' && type === 'email' && !isEmail(value)) {
            setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
            return
          }

          // if (type === 'calendar') {
          //   const year = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'year')!.value
          //   const month = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'month')!.value
          //   const day = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'day')!.value

          //   if (key === 'year' && !isValidDate(+day, +month, +value)) {
          //     setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
          //     return
          //   }

          //   if (key === 'month' && !isValidDate(+day, +value, +year)) {
          //     setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
          //     return
          //   }

          //   if (key === 'day' && !isValidDate(+value, +month, +year)) {
          //     setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
          //     return
          //   }
          // }

          const fieldData = { key, value, fieldType: name }
          if (hasValues) {
            updateField(fieldData, id)
          } else {
            if (queueRef.current.isAdding) {
              queueRef.current.queue.push(fieldData)
              return
            }

            queueRef.current = { queue: [], isAdding: true }
            const result = await addField(fieldData)
            if (!result || !result.id) {
              queueRef.current = { queue: [], isAdding: false }
              return
            }

            while (queueRef.current.queue.length) {
              await batchUpdateFields(queueRef.current.queue, result.id, result.priority)
            }

            queueRef.current = { queue: [], isAdding: false }
          }
        },
      [type, name, hasValues, updateField, addField, batchUpdateFields],
    )

    const handleEntryUpdateByKeydown = useCallback(
      (key: string, id: string, defaultValue: string) =>
        (event: React.KeyboardEvent<HTMLInputElement>) => {
          key !== 'title' && setHasErrorKeys(hasErrorKeys => hasErrorKeys.filter(k => k !== id))

          if (event.keyCode !== 13) return
          const value = event.currentTarget.value.trim()

          if (!value || value === defaultValue) return

          if (key !== 'title' && type === 'email' && !isEmail(value)) {
            setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
            return
          }

          // if (type === 'calendar') {
          //   const year = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'year')!.value
          //   const month = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'month')!.value
          //   const day = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'day')!.value

          //   if (key === 'year' && !isValidDate(+day, +month, +value)) {
          //     setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
          //     return
          //   }

          //   if (key === 'month' && !isValidDate(+day, +value, +year)) {
          //     setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
          //     return
          //   }

          //   if (key === 'day' && !isValidDate(+value, +month, +year)) {
          //     setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
          //     return
          //   }
          // }

          if (hasValues) {
            updateField({ key, value, fieldType: name }, id)
          } else {
            addField({ key, value, fieldType: name })
          }
        },
      [addField, hasValues, name, type, updateField],
    )

    // const handleEntryUpdate = useCallback(
    //   (key: string, id: string, defaultValue: string) =>
    //     (value: string) => { updateField({ key, value, fieldType: name }, id) },
    //   [updateField],
    // )

    const handleEntryDelete = useCallback(
      (id: string) => () => removeField(id),
      [removeField],
    )
    const handleEntryToggleHide = useCallback(
      (id: string) => () => toggleHideField(id),
      [toggleHideField],
    )

    const sortingId = useInput('')

    const calculatedFieldValues = useMemo(
      () => {
        const values1 = hasValues ? localFieldValues : [backupFieldValue]

        if (editable) return values1
        const records = values1.map(it => (
          [
            joinSegmentFieldValues(it.values),
            (it.values.find(v => v.key === 'title') || { value: '' }).value,
            it,
          ] as [string, string, FieldValue])
        ).reduce(
          (obj, [key, title, fieldValue]) => {
            if (fieldValue.priority === 0) {
              return obj
            }
            const newItem = { title, value: fieldValue, priority: fieldValue.priority }
            if (!obj[key]) {
              obj[key] = [newItem]
            } else {
              const titleMatched = obj[key].filter(r => r.title === newItem.title)
              if (titleMatched.length === 0) {
                obj[key] = obj[key].concat(newItem)
              } else if (newItem.priority > titleMatched[0].priority) {
                obj[key] = obj[key].filter(r => r.title !== newItem.title).concat(newItem)
              }
            }
            return obj
          },
          // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
          {} as { [key: string]: Array<{title: string, value: FieldValue, priority: FieldValue['priority'] }> }
        )

        let values2: FieldValue[] = []
        for (let key in records) {
          values2.push(...records[key].map(it => it.value))
        }

        values2.sort((p, c) => c.priority - p.priority)

        return values2
      },
      [editable, hasValues, localFieldValues, backupFieldValue]
    )

    const onSortEnd = useCallback(
      async ({oldIndex, newIndex}) => {
        sortingId.clear()
        const valueOfOld = localFieldValues[oldIndex]
        const valueOfNew = localFieldValues[newIndex]
        const previousValueOfNew = localFieldValues[newIndex - 1]
        setLocalFieldValues(values => arrayMove(values, oldIndex, newIndex))
        const newPriority = !previousValueOfNew
          ? valueOfNew.priority + 1
          : (valueOfNew.priority + previousValueOfNew.priority) / 2

        const field = await onChangePriority(name, valueOfOld.id || '', newPriority)
        if (field) {
          setLocalFieldValues(
            values => values
              .map(v => v.id === valueOfOld.id ? field : v)
              .sort((p, c) => c.priority - p.priority),
          )
        }
      },
      [sortingId, localFieldValues, onChangePriority, name],
    )

    const onDateChange = useCallback(
      (id?: string) => async (date: Date | null) => {
        if (!date) {
          if (hasValues && id) {
            updateDateField(0, 0 , 0, id)
          }
          return
        }

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        if (hasValues && id) {
          updateDateField(year, month, day, id)
        } else {
          const fieldData = [{ key: 'year', value: year, fieldType: name }, { key: 'month', value: month, fieldType: name }, { key: 'day', value: day, fieldType: name }]

          if (queueRef.current.isAdding) {
            // Note: type unsafe, but implementation works
            queueRef.current.queue.push(...fieldData as any)
            return
          }

          queueRef.current = { queue: [], isAdding: true }
          const result = await addDateField(year, month, day)
          if (!result || !result.id) {
            queueRef.current = { queue: [], isAdding: false }
            return
          }

          while (queueRef.current.queue.length) {
            await batchUpdateFields(queueRef.current.queue, result.id, result.priority)
          }

          queueRef.current = { queue: [], isAdding: false }
        }
      },
      [hasValues, updateDateField, name, addDateField, batchUpdateFields],
    )

    const renderField = useCallback(
      (values: FieldSegmentValue[], fieldValue: FieldValue, isFirst: boolean, isAppend: boolean) => (
        <div className={classnames(
          classes.fieldTextBar,
          !editable && !joinSegmentFieldValues(values) && classes.hidden,
          editable && fieldValue.priority === 0 && classes.disabled,
        )}>
          {editable
            ? (
              <>
                {type === 'calendar' && (
                  <BasicDateInput
                    className={classes.fieldTypeText}
                    date={getFieldDate(values)}
                    onDateChange={onDateChange(fieldValue.id)}
                    disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                    placeholder="date"
                  />
                )}
                {type !== 'calendar' && values.filter(segmentValue => segmentValue.key !== 'title')
                  .map(segmentValue => (
                    <Input
                      autoComplete="no"
                      key={segmentValue.key}
                      type={
                        (type === 'address' && segmentValue.key === 'zipcode')
                          ? 'number'
                          : type
                      }
                      error={hasErrorKeys.includes(fieldValue.id || '')}
                      className={classnames(
                        classes.fieldTypeText,
                        isAppend && classes.takeQuarter,
                      )}
                      classes={{
                        disabled: classes.fieldDisabled,
                        input: classes.input,
                      }}
                      placeholder={camelToWords(segmentValue.key)}
                      defaultValue={segmentValue.value}
                      onBlur={handleEntryUpdateByBlur(
                        segmentValue.key,
                        fieldValue.id || '',
                        segmentValue.value,
                      )}
                      onKeyDown={handleEntryUpdateByKeydown(
                        segmentValue.key,
                        fieldValue.id || '',
                        segmentValue.value,
                      )}
                      disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                    />
                  ))
                }
                {!isAppend && hasTitle &&(
                  <Input
                    autoComplete="no"
                    className={classes.fieldTypeText}
                    classes={{disabled: classes.fieldDisabled}}
                    defaultValue={getFieldDefaultTitle(fieldValue)}
                    onBlur={handleEntryUpdateByBlur('title', fieldValue.id || '', '')}
                    onKeyDown={handleEntryUpdateByKeydown('title', fieldValue.id || '', '')}
                    placeholder={getLabelExample(type)}
                    disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                  />
                )}
              </>
            )
            : (
              <span className={classnames(
                classes.fieldDisplayText,
                showName && classes.fieldSimpleDisplayText,
              )}>
                {joinSegmentFieldValues(values)}
              </span>
            )
          }
          {(hasTitle && !editable) && (
            <Typography variant="body2" className={classes.fieldLabelText}>
              {getFieldDefaultTitleWidthDec(fieldValue)}
            </Typography>
          )}
          {editable && !isAppend && (
            <div className={classnames(classes.filedIconBox, isAppend && classes.takePlace)}>
              <Tooltip title={fieldValue.priority === 0 ? 'display' : 'hide'}>
                <IconButton
                  className={classnames(classes.fieldControlIcon, classes.fieldHoverShowingIcon)}
                  onClick={handleEntryToggleHide(fieldValue.id || '')}
                >
                  <SvgIcon
                    name={ICONS.Eye}
                    color={fieldValue.priority === 0 ? 'hoverLighten' : 'secondary'}
                    size="sm"
                  />
                </IconButton>
              </Tooltip>
              <SortHandler
                element={
                  <Tooltip title="reorder">
                    <IconButton
                      className={classnames(
                        classes.fieldControlIcon,
                        classes.fieldHoverShowingIcon,
                        classes.fieldDragIcon,
                        classes.showInDragged,
                      )}
                    >
                      <SvgIcon
                        name={ICONS.Reorder}
                        color="hoverLighten" size="sm"
                      />
                    </IconButton>
                  </Tooltip>
                }
              />
              {expandable && (isFirst
                ? (
                  <Tooltip title="add">
                    <IconButton
                      className={classnames(
                        classes.fieldControlIcon,
                        classes.hiddenInDragged,
                      )}
                      onClick={handleAddEntry}
                    >
                      <SvgIcon
                        name={ICONS.AddCircle}
                        color="hoverLighten" size="sm"
                      />
                    </IconButton>
                  </Tooltip>
                )
                : (
                  <Tooltip title="delete">
                    <IconButton
                      className={classnames(
                        classes.fieldControlIcon,
                        classes.hiddenInDragged,
                      )}
                      onClick={handleEntryDelete(fieldValue.id || '')}>
                      <SvgIcon
                        name={ICONS.Delete}
                        color="hoverLighten" size="sm"
                      />
                    </IconButton>
                  </Tooltip>
                )
              )}
            </div>
          )}
        </div>
      ),
      [classes.fieldTextBar, classes.hidden, classes.disabled, classes.fieldTypeText, classes.fieldDisabled, classes.fieldDisplayText, classes.fieldSimpleDisplayText, classes.fieldLabelText, classes.filedIconBox, classes.takePlace, classes.fieldControlIcon, classes.fieldHoverShowingIcon, classes.fieldDragIcon, classes.showInDragged, classes.hiddenInDragged, classes.takeQuarter, classes.input, editable, type, onDateChange, hasTitle, handleEntryUpdateByBlur, handleEntryUpdateByKeydown, showName, handleEntryToggleHide, expandable, handleAddEntry, handleEntryDelete, hasErrorKeys]
    )

    const sortableItems = useMemo(
      () => calculatedFieldValues.map(
        (fieldValue, index) => ({
          element: (
            <div className={classnames(
              classes.fieldTextBarWrapper,
              !editable && fieldValue.priority === 0 && classes.hidden,
            )}>
              {renderField(fieldValue.values, fieldValue, index === 0, false)}
              {fieldValue.appendValues
                && fieldValue.appendValues.length
                && renderField(fieldValue.appendValues, fieldValue, index === 0, true)}
            </div>
          ),
          id: fieldValue.id,
        }),
      ),
      [calculatedFieldValues, classes.fieldTextBarWrapper, classes.hidden, editable, renderField],
    )

    const onSortStart = useCallback(
      ({ index }: { index: number }) => {
        sortingId.setValue(calculatedFieldValues[index].id || '')
      },
      [calculatedFieldValues, sortingId],
    )

    return (
      <div
        className={classnames(
          classes.fieldBar,
          showName && classes.fieldSimpleBar,
          (!editable && calculatedFieldValues.filter(value => joinSegmentFieldValues(value.values)).length === 0) && classes.hidden,
        )}
        ref={containerRef}
      >
        {!showName && Icon &&
          <div className={classes.fieldNameWrapper}>
            <Tooltip title={fieldName} classes={{ tooltip: classes.toolTip }}>
              <div><Icon className={classes.fieldIcon} /></div>
            </Tooltip>
          </div>
        }
        <div className={classnames(
          classes.fieldTextWrapper,
          sortingId.hasValue && classes.isSorting,
        )}>
          {showName
            && (
              <div className={classes.fieldTitle}>
                {Icon && (
                  <Tooltip title={fieldName}>
                    <div><Icon className={classnames(classes.fieldIcon, classes.fieldTitleIcon)} /></div>
                  </Tooltip>
                )}
                <Typography variant="h6" className={classnames(classes.fieldName, classes.fieldTitleName)} color="textSecondary">{fieldName}</Typography>
              </div>
            )
          }
          <SortableList
            onSortStart={onSortStart}
            onSortEnd={onSortEnd}
            useDragHandle
            helperContainer={containerRef.current || undefined}
            helperClass={classes.dragged}
            disabled={!hasValues}
          >
            {sortableItems}
          </SortableList>
        </div>
      </div>
    )
  })

export default ContactFieldInput

export type TextInputProps = InputProps & {
  value: string
  updateField: (value: string) => void
}

export type SelectedInputProps = InputProps & {
  value: string
  options: string[]
  updateField: (value: string) => void
}

export type DataInputProps = InputProps & {
  value: string
  updateField: (value: string) => void
}

export const ContactTextFieldInput: React.FC<TextInputProps> = React.memo(({
  fieldName = '', showName = false, Icon, editable, type, hasTitle, name, value, updateField,
}) => {
  const classes = useStyles({})

  const [hasError, setHasError] = useState(true)

  const handleEntryUpdateByBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const val = event.target.value.trim()

      if (!val || val === value) return

      if (type === 'email' && !isEmail(value)) {
        setHasError(true)
        return
      }

      updateField(val)
    },
    [value, type, updateField],
  )
  const handleEntryUpdateByKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      setHasError(false)

      if (event.keyCode !== 13) return
      const val = event.currentTarget.value.trim()

      if (!val || val === value) return

      if (type === 'email' && !isEmail(value)) {
        setHasError(true)
        return
      }

      updateField(val)
    },
    [type, updateField, value],
  )

  return (
    <div
      className={classnames(
        classes.fieldBar,
        showName && classes.fieldSimpleBar,
        (!editable && value === '') && classes.hidden,
      )}
    >
      {!showName && Icon && (
        <div className={classes.fieldNameWrapper}>
          <Tooltip title={fieldName} classes={{ tooltip: classes.toolTip }}>
            <div><Icon className={classes.fieldIcon} /></div>
          </Tooltip>
        </div>
      )}
      <div className={classes.fieldTextWrapper}>
        {showName
          && (
            <>
              {Icon && (
                <div>
                  <Tooltip title={fieldName}>
                    <div><Icon className={classnames(classes.fieldIcon, classes.fieldTitleIcon)} /></div>
                  </Tooltip>
                </div>
              )}
              <Typography variant="h6" className={classnames(classes.fieldName, classes.fieldTitleName)} color="textSecondary">{fieldName}</Typography>
            </>
          )
        }
        <div
          className={classnames(
            classes.fieldTextBarWrapper,
          )}
        >
          <div className={classes.fieldTextBar}>
            {(hasTitle && !editable) && (
              <Typography variant="h6" className={classes.fieldTypeText}>
                {name}
              </Typography>
            )}
            {editable
              ? (
                <Input
                  autoComplete="no"
                  key={name}
                  type={type}
                  error={hasError}
                  className={classes.fieldInput}
                  classes={{
                    input: classes.input,
                  }}
                  placeholder={name}
                  defaultValue={value}
                  onBlur={handleEntryUpdateByBlur}
                  onKeyDown={handleEntryUpdateByKeydown}
                />
              )
              : (
                <Input
                  autoComplete="no"
                  disabled={true}
                  disableUnderline={true}
                  className={classes.fieldInput}
                  value={value}
                />
              )
            }
          </div>
          {editable && (
            <div className={classes.filedIconBox}>
              <IconButton className={classes.fieldControlIcon}>
                <SvgIcon
                  name={ICONS.Eye}
                  className={classes.placeholderIcon}
                  color="hoverLighten" size="sm"
                />
              </IconButton>
              <IconButton className={classes.fieldControlIcon}>
                <SvgIcon
                  name={ICONS.Reorder}
                  className={classes.placeholderIcon}
                  color="hoverLighten" size="sm"
                />
              </IconButton>
              <IconButton className={classes.fieldControlIcon}>
                <SvgIcon
                  name={ICONS.AddCircle}
                  className={classes.placeholderIcon}
                  color="hoverLighten" size="sm"
                />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

const mapOption2SelectOption = (option: string) => option === ''
  ? ({ value: '', label: 'None' })
  : ({ value: option, label: option })

export const ContactSelectedFieldInput: React.FC<SelectedInputProps> = React.memo(({
  fieldName = '', showName = false, Icon, editable, hasTitle, name, value, options, updateField,
}) => {
  const classes = useStyles({})

  const handleEntryUpdate = useCallback(
    (input: any) => {
      updateField(input.value)
    },
    [updateField],
  )

  const selectOptions = useMemo(
    () => options.map(mapOption2SelectOption),
    [options]
  )

  return (
    <div
      className={classnames(
        classes.fieldBar,
        showName && classes.fieldSimpleBar,
        (!editable && value === '') && classes.hidden,
      )}>
      {!showName && Icon && (
        <div className={classes.fieldNameWrapper}>
          <Tooltip title={fieldName} classes={{ tooltip: classes.toolTip }}>
            <div><Icon className={classes.fieldIcon} /></div>
          </Tooltip>
        </div>
      )}
      <div className={classes.fieldTextWrapper}>
        {showName && (
          <div className={classes.fieldTitle}>
            {Icon && (
              <div>
                <Tooltip title={fieldName}>
                  <div><Icon className={classnames(classes.fieldIcon, classes.fieldTitleIcon)} /></div>
                </Tooltip>
              </div>
            )}
            <Typography
              variant="h6"
              className={classnames(
                classes.fieldName,
                classes.fieldTitleName,
              )}
              color="textSecondary"
            >
              {fieldName}
            </Typography>
          </div>
        )}
        <div
          className={classnames(
            classes.fieldTextBarWrapper,
          )}
        >
          <div className={classes.fieldTextBar}>
            {(hasTitle && !editable) && (
              <Typography variant="h6" className={classes.fieldTypeText}>
                {name}
              </Typography>
            )}
            {editable ? (
              <Select
                className={classes.fieldInput}
                classes={classes}
                components={components}
                props={{
                  placeholder: fieldName,
                }}
                isSearchable={false}
                isClearable={false}
                options={selectOptions}
                onChange={handleEntryUpdate}
                value={mapOption2SelectOption(value)}
              />
            ) : (
              <Input
                autoComplete="no"
                disabled={true}
                disableUnderline={true}
                className={classes.fieldInput}
                classes={{
                  input: classes.fieldDisplayText,
                }}
                value={value}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

// export const ContactDateFieldInput: React.FC<SelectedInputProps> = React.memo(({
//   fieldName = '', showName = false, Icon, editable, hasTitle, name, value, options, updateField,
// }) => {
//   const classes = useStyles({})

//   const handleEntryUpdate = useCallback(
//     (event: React.ChangeEvent<HTMLSelectElement>) => {
//       const val = event.target.value.trim()

//       updateField(val)
//     },
//     [],
//   )

//   return (
//     <div className={classnames(classes.fieldBar, showName && classes.fieldSimpleBar)}>
//       {showName
//         ? <Typography variant="h6" className={classnames(classes.fieldName, classes.fieldTitleName)} color="textSecondary">{fieldName}</Typography>
//         : Icon && <Icon className={classes.fieldIcon} />}
//       <div className={classes.fieldTextWrapper}>
//         <div
//           className={classnames(
//             classes.fieldTextBarWrapper,
//             !editable && classes.hidden,
//           )}
//         >
//           <div className={classes.fieldTextBar}>
//             {(hasTitle && !editable) && (
//               <Typography variant="h6" className={classes.fieldTypeText}>
//                 {name}
//               </Typography>
//             )}
//             {editable
//               ? (
//                 <Select
//                   className={classes.fieldInput}
//                   defaultValue={value}
//                   onChange={handleEntryUpdate}
//                 >
//                   {options.map(option => (
//                     <MenuItem value={option} key={option}>
//                       <em>{option || 'None'}</em>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )
//               : (
//                 <Input
//                   autoComplete="no"
//                   disabled={true}
//                   disableUnderline={true}
//                   className={classes.fieldInput}
//                   value={value}
//                 />
//               )
//             }
//           </div>
//           {editable && (
//             <div className={classes.filedIconBox}>
//               <IconButton className={classes.fieldControlIcon}>
//                 <Eye className={classes.placeholderIcon} />
//               </IconButton>
//               <IconButton className={classes.fieldControlIcon}>
//                 <Reorder className={classes.placeholderIcon} />
//               </IconButton>
//               <IconButton className={classes.fieldControlIcon}>
//                 <AddCircleIcon className={classes.placeholderIcon} />
//               </IconButton>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// })
