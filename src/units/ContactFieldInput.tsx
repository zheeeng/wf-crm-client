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
import { isEmail } from '~src/utils/validation'
import camelToWords from '~src/utils/camelToWords'
import SvgIcon, { ICONS } from '~src/units/Icons'
import { FieldType } from '~src/types/Contact'
import {
  FieldSegmentValue, FieldValue,
  joinSegmentFieldValues,
  getLabelExample, getFieldDefaultTitle, getFieldDefaultTitleWidthDec,
  mapOption2SelectOption,
  getLowerPriority, getFieldDateFromValues,
} from './ContactFieldInputUtils'
import { LabelWithIcon, LabelWithText } from './ContactFieldInputs/Label'

const useStyles = makeStyles((theme: Theme) => ({
  hidden: {
    '&&': {
      display: 'none',
    },
  },
  disabled: {
    cursor: 'not-allowed',
  },
  weakenEffect: {
    opacity: 0.4,
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
  filedIconBox: {
    display: 'flex',
    marginTop: theme.spacing(1),
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
    '&&': {
      cursor: 'not-allowed',
    },
    '&:before': {
      borderBottomStyle: 'solid',
    },
  },
}))

export type InputProps = {
  fieldName: string
  showName?: boolean
  Icon?: React.ComponentType<{ className?: string, color?: any }>
  name: FieldType
  hasTitle: boolean
  editable?: boolean
  type?: string
}

// ------------------------ Text Input Start ------------------------
export type Props = InputProps & {
  fieldValues: FieldValue[]
  backupFieldValue: FieldValue
  isMultiple: boolean
  onAdd (fieldType: string, addObj: any, priority: number): Promise<FieldValue | null>
  onUpdate (fieldType: string, updateObj: any, id: string, priority: number): Promise<FieldValue | null>
  onDelete (name: string, id: string): Promise<string | null>
  onChangePriority (name: string, id: string, priority: number): Promise<FieldValue | null>
}

export const ContactFieldInput: React.FC<Props> = React.memo(
  ({ fieldName = '', showName = false, Icon, name, fieldValues, backupFieldValue,
    editable = false, type, hasTitle, isMultiple,
    onAdd, onUpdate, onDelete, onChangePriority,
  }) => {

    const classes = useStyles({})

    const [ localFieldValues, setLocalFieldValues ] = useState(fieldValues)

    useEffect(
      () => setLocalFieldValues(fieldValues),
      [fieldValues],
    )

    const containerRef = useRef<HTMLDivElement>(null)

    const addField = useCallback(
      async () => {
        // TODO: collect data
        const field = await onAdd(name, {}, getLowerPriority(localFieldValues))
        if (field) setLocalFieldValues(values => values.concat(field))
        return field
      },
      [localFieldValues, onAdd, name, setLocalFieldValues],
    )

    const updateField = useCallback(
      async (segmentValue: FieldSegmentValue, id: string) => {
        if (!id) return
        const fieldValue = localFieldValues.find(value => value.id === id)
        if (!fieldValue) return

        const field = await onUpdate(name, { [segmentValue.key]: segmentValue.value }, id, fieldValue.priority)
        if (field) setLocalFieldValues(values => values.map(v => v.id === id ? field : v))
        return field
      },
      [localFieldValues, onUpdate, name, setLocalFieldValues],
    )

    const addDateField = useCallback(
      async (year: number, month: number, day: number) => {
        const field = await onAdd(name, { year, month, day }, getLowerPriority(localFieldValues))
        if (field) setLocalFieldValues(values => values.concat(field))
        return field
      },
      [localFieldValues, name, onAdd, setLocalFieldValues],
    )
    const updateDateField = useCallback(
      async (year: number, month: number, day: number, id: string) => {
        if (!id) return
        const fieldValue = localFieldValues.find(value => value.id === id)
        if (!fieldValue) return

        const field = await onUpdate(name, { year, month, day }, id, fieldValue.priority)
        if (field) setLocalFieldValues(values => values.map(v => v.id === id ? field : v))
      },
      [localFieldValues, name, onUpdate, setLocalFieldValues]
    )

    const removeField = useCallback(
      (id: string) => async () => {
        if (!id) return

        const removedId = await onDelete(name, id)

        if (removedId) setLocalFieldValues(values => values.filter(v => v.id !== removedId))
      },
      [onDelete, name, setLocalFieldValues],
    )

    const toggleHideField = useCallback(
      (id: string) => async () => {
        if (!id) return

        const targetField = localFieldValues.find(v => v.id === id)

        if (!targetField) return

        const newPriority = targetField.priority !== 0 ? 0 : getLowerPriority(localFieldValues)

        const field = await onChangePriority(name, id, newPriority)

        if (!field) return

        setLocalFieldValues(values => values.map(v => v.id === id ? field : v).sort((p, c) => c.priority - p.priority))
      },
      [localFieldValues, onChangePriority, name],
    )

    const [hasErrorKeys, setHasErrorKeys] = useState<string[]>([])

    const sortingId = useInput('')

    const calculatedFieldValues = useMemo(
      () => {
        if (editable) return localFieldValues

        const records = localFieldValues.map(it => (
          [
            joinSegmentFieldValues(name, it.values),
            (it.values.find(v => v.key === 'title') || { value: '' }).value,
            it,
          ] as [string, string, FieldValue])
        ).reduce(
          (obj, [key, title, fieldValue]) => {
            if (fieldValue.priority === 0) return obj

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
      [editable, localFieldValues, name]
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
        if (!date || !id) return

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        updateDateField(year, month, day, id)
      },
      [updateDateField],
    )

    const renderField = useCallback(
      (values: FieldSegmentValue[], fieldValue: FieldValue, isStub: boolean, isAppend: boolean) => (
        <div className={classnames(
          classes.fieldTextBar,
          !editable && !joinSegmentFieldValues(name, values) && classes.hidden,
          editable && fieldValue.priority === 0 && classes.disabled,
        )}>
          {editable
            ? (
              <>
                {type === 'calendar' && (
                  <BasicDateInput
                    className={classnames(classes.fieldTypeText, editable && fieldValue.priority === 0 && classes.weakenEffect)}
                    date={getFieldDateFromValues(values)}
                    onDateChange={onDateChange(fieldValue.id)}
                    disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                  />
                )}
                {type !== 'calendar' && values.filter(segmentValue => segmentValue.key !== 'title')
                  .map(segmentValue => (
                    <Input
                      autoComplete="no"
                      key={segmentValue.key}
                      error={hasErrorKeys.includes(fieldValue.id || '')}
                      className={classnames(
                        classes.fieldTypeText,
                        isAppend && classes.takeQuarter,
                        editable && fieldValue.priority === 0 && classes.weakenEffect,
                      )}
                      classes={{
                        disabled: classes.fieldDisabled,
                        input: classes.input,
                      }}
                      placeholder={camelToWords(segmentValue.key)}
                      defaultValue={segmentValue.value}
                      disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                    />
                  ))
                }
                {!isAppend && hasTitle &&(
                  <Input
                    autoComplete="no"
                    className={classnames(classes.fieldTypeText, editable && fieldValue.priority === 0 && classes.weakenEffect)}
                    classes={{disabled: classes.fieldDisabled}}
                    defaultValue={getFieldDefaultTitle(fieldValue)}
                    placeholder={getLabelExample(type)}
                    disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                  />
                )}
              </>
            )
            : (
              <span className={classnames(classes.fieldDisplayText, showName && classes.fieldSimpleDisplayText)}>
                {joinSegmentFieldValues(name, values)}
              </span>
            )
          }
          {(hasTitle && !editable) && (
            <Typography variant="body2" className={classes.fieldLabelText}>
              {getFieldDefaultTitleWidthDec(fieldValue)}
            </Typography>
          )}
          {editable && !isAppend && isMultiple && (
            <div className={classnames(classes.filedIconBox, isAppend && classes.takePlace)}>
              {!isStub ? (
                <>
                  <Tooltip title={fieldValue.priority === 0 ? 'display' : 'hide'}>
                    <IconButton
                      className={classnames(classes.fieldControlIcon, classes.fieldHoverShowingIcon)}
                      onClick={toggleHideField(fieldValue.id || '')}
                    >
                      <SvgIcon name={ICONS.Eye} color={fieldValue.priority === 0 ? 'primary' : 'hoverLighten'} size="sm"/>
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
                          <SvgIcon name={ICONS.Reorder} color="hoverLighten" size="sm" />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <Tooltip title="remove">
                    <IconButton
                      className={classnames(classes.fieldControlIcon, classes.hiddenInDragged)}
                      onClick={removeField(fieldValue.id || '')}>
                      <SvgIcon name={ICONS.Remove} color="hoverLighten" size="sm" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="add">
                  <IconButton
                    className={classnames(classes.fieldControlIcon)}
                    onClick={addField}>
                    <SvgIcon name={ICONS.AddCircle} color="hoverLighten" size="sm" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      ),
      [classes.fieldTextBar, classes.hidden, classes.disabled, classes.fieldTypeText, classes.weakenEffect, classes.fieldDisabled, classes.fieldDisplayText, classes.fieldSimpleDisplayText, classes.fieldLabelText, classes.filedIconBox, classes.takePlace, classes.fieldControlIcon, classes.fieldHoverShowingIcon, classes.fieldDragIcon, classes.showInDragged, classes.hiddenInDragged, classes.takeQuarter, classes.input, editable, name, type, onDateChange, hasTitle, showName, isMultiple, toggleHideField, removeField, addField, hasErrorKeys]
    )

    const renderCombinedField = useCallback(
      (fieldValue: FieldValue, isStub: boolean) => (
        <div className={classnames(
          classes.fieldTextBarWrapper,
          !editable && fieldValue.priority === 0 && classes.hidden,
        )}>
          {renderField(fieldValue.values, fieldValue, isStub, false)}
          {fieldValue.appendValues
            && fieldValue.appendValues.length
            && renderField(fieldValue.appendValues, fieldValue, isStub, true)}
        </div>
      ),
      [classes.fieldTextBarWrapper, classes.hidden, editable, renderField],
    )

    const sortableItems = useMemo(
      () => calculatedFieldValues.map(
        fieldValue => ({
          element: renderCombinedField(fieldValue, false),
          id: fieldValue.id,
        }),
      ),
      [calculatedFieldValues, renderCombinedField],
    )

    const onSortStart = useCallback(
      ({ index }: { index: number }) => sortingId.setValue(calculatedFieldValues[index].id || ''),
      [calculatedFieldValues, sortingId],
    )

    return (
      <div
        className={classnames(
          classes.fieldBar,
          showName && classes.fieldSimpleBar,
          (!editable && calculatedFieldValues.filter(value => joinSegmentFieldValues(name, value.values.concat(value.appendValues || []))).length === 0) && classes.hidden,
        )}
        ref={containerRef}
      >
        {!showName && Icon && <LabelWithIcon Icon={Icon} fieldName={fieldName} />}
        <div className={classnames(
          classes.fieldTextWrapper,
          sortingId.hasValue && classes.isSorting,
        )}>
          {showName && <LabelWithText Icon={Icon} fieldName={fieldName} />}
          <SortableList
            onSortStart={onSortStart}
            onSortEnd={onSortEnd}
            useDragHandle
            helperContainer={containerRef.current || undefined}
            helperClass={classes.dragged}
          >
            {sortableItems}
          </SortableList>
          {renderCombinedField(backupFieldValue, true)}
        </div>
      </div>
    )
  })
// ------------------------ Text Input End ------------------------

// ------------------------ Select Input Begin ------------------------
type MergeFields<T1, T2> = {
  [P in keyof (T1 & T2)]: (P extends keyof T1 ? T1[P] : never) | (P extends keyof T2 ? T2[P] : never)
}

export type SelectedInputProps = MergeFields<InputProps, { name: 'gender' }> & {
  value: string
  options: string[]
  updateField: (value: 'Male' | 'Female' | 'Other') => void
}

export const ContactSelectedFieldInput: React.FC<SelectedInputProps> = React.memo(({
  fieldName = '', showName = false, Icon, editable, hasTitle, name, value, options, updateField,
}) => {
  const classes = useStyles({})

  const handleEntryUpdate = useCallback((input: any) => updateField(input.value), [updateField])

  const selectOptions = useMemo(() => options.map(mapOption2SelectOption), [options])

  return (
    <div
      className={classnames(
        classes.fieldBar,
        showName && classes.fieldSimpleBar,
        (!editable && value === '') && classes.hidden,
      )}>
      {!showName && Icon && <LabelWithIcon Icon={Icon} fieldName={fieldName} />}
      <div className={classes.fieldTextWrapper}>
        {showName && <LabelWithText Icon={Icon} fieldName={fieldName} />}
        <div className={classnames(classes.fieldTextBarWrapper)}>
          <div className={classes.fieldTextBar}>
            {(hasTitle && !editable) && (
              <Typography variant="h6" className={classes.fieldTypeText}>{name}</Typography>
            )}
            {editable ? (
              <Select
                className={classes.fieldInput}
                classes={classes}
                components={components}
                props={{ placeholder: fieldName }}
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
                classes={{ input: classes.fieldDisplayText }}
                value={value}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
// ------------------------ Select Input End ------------------------
