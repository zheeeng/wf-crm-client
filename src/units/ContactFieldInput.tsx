import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import SortableList, { SortHandler, arrayMove } from '~src/units/SortableList'
import cssTips from '~src/utils/cssTips'
import { isEmail, isValidDate } from '~src/utils/validation'
import SvgIcon, { ICONS } from '~src/units/Icons'
import { SimpleFormInputSelect } from '~src/units/BasicFormInputSelect'
import countries from '~src/meta/countries.json'

const countryOptions= countries.map(option => ({ label: option, value: option }))

const joinSegmentFieldValues = (values: FieldSegmentValue[]) => values
  .filter(value => value.key !== 'title')
  .map(value => value.value)
  .join(' ')

const useStyles = makeStyles((theme: Theme) => ({
  hidden: {
    '&&': {
      display: 'none',
    },
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.3,
    ...{
      '& *': {
        cursor: 'not-allowed',
      },
    },
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
  fieldTextWrapper: {
    flex: 1,
    paddingTop: theme.spacing(1),
  },
  fieldTextBarWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: theme.spacing(0, 1),
  },
  fieldTextBar: {
    flex: 1,
    width: '100%',
    display: 'flex',
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
    'visibility': 'hidden',
    '$fieldTextBarWrapper:hover &': {
      visibility: 'visible',
    },
    '$fieldTextBarWrapper:hover $takePlace &': {
      visibility: 'hidden',
    },
  },
  fieldDragIcon: {
    cursor: 'move',
  },
  fieldTypeText: {
    flex: 0.5,
    padding: theme.spacing(1, 0),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  fieldLabelText: {
    lineHeight: '1.1875em',
    padding: '14px 0 15px 0',
    textAlign: 'left',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  takeQuarter: {
    flex: 0.25,
  },
  fieldInput: {
    flex: 1,
    padding: theme.spacing(1, 0),
    color: theme.palette.text.secondary,
  },
  fieldDisplayText: {
    lineHeight: '1.1875em',
    padding: '14px 0 15px 0',
    color: theme.palette.text.secondary,
    fontWeight: 600,
  },
  addTagIcon: {
    marginRight: theme.spacing(1),
  },
  dragged: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '1px 1px 0px 2px lightgrey',
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

const getFieldDefaultTitle = (fieldValue: FieldValue) => fieldValue.values.find(sv => sv.key === 'title')!.value

const getFieldDefaultTitleWidthDec = (fieldValue: FieldValue) => {
  const defaultTitle = getFieldDefaultTitle(fieldValue).trim()
  if (defaultTitle) {
    return '• ' + defaultTitle
  }

  return
}

export interface FieldValue {
  values: FieldSegmentValue[]
  appendValues?: FieldSegmentValue[]
  id?: string
  priority: number
  waiver?: any
}

export type InputProps = {
  fieldName?: string,
  showName?: boolean,
  Icon?: React.ComponentType<{ className?: string, color?: any }>,
  name: string,
  hasTitle: boolean,
  editable?: boolean,
  type?: string,
}

export type Props = InputProps & {
  fieldValues: FieldValue[],
  backupFieldValue: FieldValue,
  expandable: boolean,
  onAddField (name: string, value: FieldSegmentValue, priority: number): Promise<FieldValue | null>,
  onUpdateField (name: string, value: FieldSegmentValue, id: string,  priority: number): Promise<FieldValue | null>
  onDeleteField (name: string, id: string): Promise<string | null>
  onChangePriority (name: string, id: string, priority: number): Promise<FieldValue | null>,
}

const ContactFieldInput: React.FC<Props> = React.memo(
  ({ fieldName = '', showName = false, Icon, name, fieldValues, backupFieldValue,
     editable = false, type, hasTitle, expandable,
     onAddField, onUpdateField, onDeleteField, onChangePriority }) => {

  const classes = useStyles({})

  const [ localFieldValues, updateLocalFieldValues ] = useState(fieldValues)

  useEffect(
    () => updateLocalFieldValues(fieldValues),
    [fieldValues],
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const hasValues = useMemo(
    () => !!fieldValues.length || !!localFieldValues.length,
    [fieldValues, localFieldValues],
  )

  const addField = useCallback(
    async (segmentValue: FieldSegmentValue) => {
      const newPriority = ((localFieldValues[0] || {}).priority || 80) + 1
      const field = await onAddField(name, segmentValue, newPriority)
      if (field) updateLocalFieldValues(values => values.concat(field))
    },
    [localFieldValues, onAddField, name],
  )
  const updateField = useCallback(
    async (segmentValue: FieldSegmentValue, id: string) => {
      if (!id) return
      const fieldValue = localFieldValues.find(value => value.id === id)
      if (!fieldValue) return
      const priority = fieldValue.priority

      const field = await onUpdateField(name, segmentValue, id, priority)
      if (field) updateLocalFieldValues(values => values.map(v => v.id === id ? field : v))
    },
    [localFieldValues, onUpdateField, name],
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
      const field = await onChangePriority(name, id, newPriority)
      if (field) {
        updateLocalFieldValues(
          values => values
            .map(v => v.id === id ? field : v)
            .sort((p, c) => c.priority - p.priority),
        )
      }
    },
    [name, localFieldValues],
  )

  const handleAddEntry = useCallback(
    () => { addField(getEmptyFieldSegmentValue(name)) },
    [localFieldValues, name],
  )

  const [hasErrorKeys, setHasErrorKeys] = useState<string[]>([])

  const handleEntryUpdateByBlur = useCallback(
    (key: string, id: string, defaultValue: string) =>
      (event: React.FocusEvent<HTMLInputElement>) => {
        const value = event.target.value.trim()

        if (!value || value == defaultValue) return

        if (key !== 'title' && type == 'email' && !isEmail(value)) {
          setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
          return
        }

        if (type == 'calendar') {
          const year = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'year')!.value
          const month = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'month')!.value
          const day = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'day')!.value

          if (key === 'year' && !isValidDate(+day, +month, +value)) {
            setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
            return
          }

          if (key === 'month' && !isValidDate(+day, +value, +year)) {
            setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
            return
          }

          if (key === 'day' && !isValidDate(+value, +month, +year)) {
            setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
            return
          }
        }

        if (hasValues) {
          updateField({ key, value, fieldType: name }, id)
        } else {
          addField({ key, value, fieldType: name })
        }
      },
    [localFieldValues, name],
  )

  const handleEntryUpdateByKeydown = useCallback(
    (key: string, id: string, defaultValue: string) =>
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        key !== 'title' && setHasErrorKeys(hasErrorKeys => hasErrorKeys.filter(k => k !== id))

        if (event.keyCode !== 13) return
        const value = event.currentTarget.value.trim()

        if (!value || value === defaultValue) return

        if (key !== 'title' && type == 'email' && !isEmail(value)) {
          setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
          return
        }

        if (type == 'calendar') {
          const year = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'year')!.value
          const month = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'month')!.value
          const day = localFieldValues.find(f => f.id === id)!.values.find(v => v.key === 'day')!.value

          if (key === 'year' && !isValidDate(+day, +month, +value)) {
            setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
            return
          }

          if (key === 'month' && !isValidDate(+day, +value, +year)) {
            setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
            return
          }

          if (key === 'day' && !isValidDate(+value, +month, +year)) {
            setHasErrorKeys(hasErrorKeys => hasErrorKeys.concat(id))
            return
          }
        }

        if (hasValues) {
          updateField({ key, value, fieldType: name }, id)
        } else {
          addField({ key, value, fieldType: name })
        }
      },
    [localFieldValues, name, type],
  )

  const handleEntryUpdate = useCallback(
    (key: string, id: string, defaultValue: string) =>
      (value: string) => {

      updateField({ key, value, fieldType: name }, id)
    },
    [],
  )

  const handleEntryDelete = useCallback(
    (id: string) => () => removeField(id),
    [localFieldValues],
  )
  const handleEntryToggleHide = useCallback(
    (id: string) => () => toggleHideField(id),
    [localFieldValues],
  )

  const onSortEnd = useCallback(
    async ({oldIndex, newIndex}) => {
      const valueOfOld = localFieldValues[oldIndex]
      const valueOfNew = localFieldValues[newIndex]
      const previousValueOfNew = localFieldValues[newIndex - 1]
      updateLocalFieldValues(values => arrayMove(values, oldIndex, newIndex))
      const newPriority = !previousValueOfNew
        ? valueOfNew.priority + 1
        : (valueOfNew.priority + previousValueOfNew.priority) / 2

      const field = await onChangePriority(name, valueOfOld.id!, newPriority)
      if (field) {
        updateLocalFieldValues(
          values => values
            .map(v => v.id === valueOfOld.id ? field : v)
            .sort((p, c) => c.priority - p.priority),
        )
      }
    },
    [localFieldValues],
  )

  const renderField = useCallback(
    (values: FieldSegmentValue[], fieldValue: FieldValue, isFirst: boolean, isAppend: boolean) => (
      <div className={classnames(
        classes.fieldTextBar,
        !editable && !joinSegmentFieldValues(values).trim() && classes.hidden,
        editable && fieldValue.priority === 0 && classes.disabled,
      )}>
        {editable
          ? (
            <>
              {values.filter(segmentValue => segmentValue.key !== 'title')
                .map(segmentValue => (type === 'address' && segmentValue.key === 'country')
                  ? (
                    <SimpleFormInputSelect
                      key={segmentValue.key}
                      className={classnames(classes.fieldTypeText, isAppend && classes.takeQuarter)}
                      onChange={handleEntryUpdate(segmentValue.key, fieldValue.id!, segmentValue.value)}
                      placeholder="country"
                      disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                      options={countryOptions}
                    />
                  ) : (
                    <Input
                      key={segmentValue.key}
                      type={type === 'calendar' ? 'number' : type}
                      error={hasErrorKeys.includes(fieldValue.id || '')}
                      className={classnames(classes.fieldTypeText, isAppend && classes.takeQuarter)}
                      classes={{disabled: classes.fieldDisabled}}
                      placeholder={segmentValue.key}
                      defaultValue={segmentValue.value}
                      onBlur={handleEntryUpdateByBlur(segmentValue.key, fieldValue.id!, segmentValue.value)}
                      onKeyDown={handleEntryUpdateByKeydown(segmentValue.key, fieldValue.id!, segmentValue.value)}
                      disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                    />
                  )
                )
              }
              {!isAppend && hasTitle &&(
                <Input
                  className={classes.fieldTypeText}
                  classes={{disabled: classes.fieldDisabled}}
                  defaultValue={getFieldDefaultTitle(fieldValue)}
                  onBlur={handleEntryUpdateByBlur('title', fieldValue.id!, '')}
                  onKeyDown={handleEntryUpdateByKeydown('title', fieldValue.id!, '')}
                  placeholder={'label'}
                  disabled={fieldValue.priority === 0 || !!fieldValue.waiver}
                />
              )}
            </>
          )
          : (
            <span className={classes.fieldDisplayText}>
              {joinSegmentFieldValues(values)}
            </span>
          )
        }
        {(hasTitle && !editable) && (
          <Typography variant="body2" className={classes.fieldLabelText}>
            {getFieldDefaultTitleWidthDec(fieldValue)}
          </Typography>
        )}
        {editable && (
          <div className={classnames(classes.filedIconBox, isAppend && classes.takePlace)}>
            <IconButton
              className={classnames(classes.fieldControlIcon, classes.fieldHoverShowingIcon)}
              onClick={handleEntryToggleHide(fieldValue.id!)}
            >
              <SvgIcon
                name={ICONS.Eye}
                color={fieldValue.priority === 0 ? 'hoverLighten' : 'secondary'}
                size="sm"
              />
            </IconButton>
            <SortHandler
              element={
                <IconButton
                  className={classnames(
                    classes.fieldControlIcon,
                    classes.fieldHoverShowingIcon,
                    classes.fieldDragIcon,
                  )}
                >
                  <SvgIcon
                    name={ICONS.Reorder}
                    color="hoverLighten" size="sm"
                  />
                </IconButton>
              }
            />
            {expandable && (isFirst
              ? (
                <IconButton
                  className={classes.fieldControlIcon}
                  onClick={handleAddEntry}
                >
                  <SvgIcon
                    name={ICONS.AddCircle}
                    color="hoverLighten" size="sm"
                  />
                </IconButton>
              )
              : (
                <IconButton
                  className={classes.fieldControlIcon}
                  onClick={handleEntryDelete(fieldValue.id!)}>
                  <SvgIcon
                    name={ICONS.Delete}
                    color="hoverLighten" size="sm"
                  />
                </IconButton>
              )
            )}
          </div>
        )}
      </div>
    ),
    [editable, hasTitle, hasErrorKeys,
      handleAddEntry, handleEntryUpdateByBlur, handleEntryUpdateByKeydown,
      handleEntryToggleHide, handleEntryDelete]
  )

  const sortableItems = useMemo(
    () => (hasValues ? localFieldValues : [backupFieldValue]).map(
      (fieldValue, index) => ({
        element: (
          <div className={classnames(
            classes.fieldTextBarWrapper,
            !editable && fieldValue.priority === 0 && classes.hidden
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
    [hasValues, localFieldValues, backupFieldValue, editable],
  )

  return (
    <div className={classes.fieldBar} ref={containerRef}>
      {showName
        ? <Typography variant="h5" className={classes.fieldName}>{fieldName}</Typography>
        : Icon && <Icon className={classes.fieldIcon} />}
      <div className={classes.fieldTextWrapper}>
        <SortableList
          onSortEnd={onSortEnd}
          useDragHandle
          helperContainer={containerRef.current || undefined}
          helperClass={classes.dragged}
        >
          {sortableItems}
        </SortableList>
      </div>
    </div>
  )
})

export default ContactFieldInput

export type TextInputProps = InputProps & {
  value: string,
  updateField: (value: string) => void,
}

export type SelectedInputProps = InputProps & {
  value: string,
  options: string[],
  updateField: (value: string) => void,
}

export type DataInputProps = InputProps & {
  value: string,
  updateField: (value: string) => void,
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

      if (type == 'email' && !isEmail(value)) {
        setHasError(true)
        return
      }

      updateField(val)
    },
    [],
  )
  const handleEntryUpdateByKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      setHasError(false)

      if (event.keyCode !== 13) return
      const val = event.currentTarget.value.trim()

      if (!val || val === value) return

      if (type == 'email' && !isEmail(value)) {
        setHasError(true)
        return
      }

      updateField(val)
    },
    [],
  )

  return (
    <div className={classes.fieldBar}>
      {showName
        ? <Typography variant="h5" className={classes.fieldName}>{fieldName}</Typography>
        : Icon && <Icon className={classes.fieldIcon} />}
      <div className={classes.fieldTextWrapper}>
        <div
          className={classnames(
            classes.fieldTextBarWrapper,
            !editable && classes.hidden,
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
                  key={name}
                  type={type}
                  error={hasError}
                  className={classes.fieldInput}
                  placeholder={name}
                  defaultValue={value}
                  onBlur={handleEntryUpdateByBlur}
                  onKeyDown={handleEntryUpdateByKeydown}
                />
              )
              : (
                <Input
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

export const ContactSelectedFieldInput: React.FC<SelectedInputProps> = React.memo(({
  fieldName = '', showName = false, Icon, editable, type, hasTitle, name, value, options, updateField,
}) => {
  const classes = useStyles({})

  const handleEntryUpdate = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const val = event.target.value.trim()

      updateField(val)
    },
    [],
  )

  return (
    <div className={classes.fieldBar}>
      {showName
        ? <Typography variant="h5" className={classes.fieldName}>{fieldName}</Typography>
        : Icon && <Icon className={classes.fieldIcon} />}
      <div className={classes.fieldTextWrapper}>
        <div
          className={classnames(
            classes.fieldTextBarWrapper,
            !editable && classes.hidden,
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
                <Select
                  className={classes.fieldInput}
                  value={value}
                  onChange={handleEntryUpdate}
                >
                  {options.map(option => (
                    <MenuItem value={option} key={option}>
                      <em>{option || 'None'}</em>
                    </MenuItem>
                  ))}
                </Select>
              )
              : (
                <Input
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
//     <div className={classes.fieldBar}>
//       {showName
//         ? <Typography variant="h5" className={classes.fieldName}>{fieldName}</Typography>
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
