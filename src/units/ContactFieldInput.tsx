import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import AddCircle from '@material-ui/icons/AddCircle'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import Eye from '@material-ui/icons/RemoveRedEye'
import Reorder from '@material-ui/icons/Reorder'
import SortableList, { SortHandler, arrayMove } from '~src/units/SortableList'
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
    paddingTop: theme.spacing.unit,
  },
  fieldTextBarWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing.unit}px`,
  },
  fieldTextBar: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
    ...cssTips(theme, { sizeFactor: 2 }).horizontallySpaced,
  },
  fieldName: {
    padding: theme.spacing.unit * 2.5,
    height: theme.spacing.unit * 8,
    width: theme.spacing.unit * 16,
    marginRight: theme.spacing.unit * 2.5,
    textAlign: 'left',
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
  placeholderIcon: {
    visibility: 'hidden',
  },
  fieldHoverShowingIcon: {
    'visibility': 'hidden',
    '$fieldTextBarWrapper:hover &': {
      visibility: 'visible',
    },
  },
  fieldDragIcon: {
    cursor: 'move',
  },
  fieldTypeText: {
    flex: 0.5,
    padding: `${theme.spacing.unit}px 0`,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  fieldInput: {
    flex: 1,
    padding: `${theme.spacing.unit}px 0`,
    color: theme.palette.grey.A400,
  },
  addTagIcon: {
    marginRight: theme.spacing.unit,
  },
  dragged: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '1px 1px 0px 2px lightgrey',
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
  waiver?: any
}

export type InputProps = {
  fieldName?: string,
  showName?: boolean,
  Icon?: React.ComponentType<{ className?: string, color?: any }>,
  name: string,
  hasTitle: boolean,
  editable?: boolean,
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
     editable = false, hasTitle, expandable,
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

  const sortableItems = useMemo(
    () => (hasValues ? localFieldValues : [backupFieldValue]).map(
      (fieldValue, index) => ({
        element: (
          <div
            className={classnames(
              classes.fieldTextBarWrapper,
              !editable && fieldValue.priority === 0 && classes.hidden,
            )}
          >
            <div className={classnames(
              classes.fieldTextBar,
              editable && fieldValue.priority === 0 && classes.disabled,
            )}>
              {(hasTitle && !editable) && (
                <Typography variant="h6" className={classes.fieldTypeText}>
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
                          disabled={fieldValue.priority === 0 || fieldValue.waiver}
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
                    value={fieldValue.values
                      .filter(sv => sv.key !== 'title')
                      .map(sv => sv.value)
                      .join(' ')
                    }
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
                <SortHandler
                  element={
                    <IconButton
                      className={classnames(
                        classes.fieldControlIcon,
                        classes.fieldHoverShowingIcon,
                        classes.fieldDragIcon,
                      )}
                    >
                      <Reorder color="disabled" />
                    </IconButton>
                  }
                />
                {expandable && (index === 0
                  ? (
                    <IconButton
                      className={classes.fieldControlIcon}
                      onClick={handleAddEntry}
                    >
                      <AddCircle color="primary" />
                    </IconButton>
                  )
                  : (
                    <IconButton
                      className={classes.fieldControlIcon}
                      onClick={handleEntryDelete(fieldValue.id!)}>
                      <RemoveCircle color="disabled" />
                    </IconButton>
                  )
                )}
              </div>
            )}
          </div>
        ),
        id: fieldValue.id,
      }),
    ),
    [
      hasValues, localFieldValues, backupFieldValue, editable, hasTitle,
      handleAddEntry, handleEntryUpdateByBlur, handleEntryUpdateByKeydown,
      handleEntryToggleHide, handleEntryDelete,
    ],
  )

  return (
    <div className={classes.fieldBar} ref={containerRef}>
      {showName
        ? <Typography variant="h5" className={classes.fieldName}>{fieldName}</Typography>
        : Icon && <Icon className={classes.fieldIcon} color="primary" />}
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
  fieldName = '', showName = false, Icon, editable, hasTitle, name, value, updateField,
}) => {
  const classes = useStyles({})

  const handleEntryUpdateByBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const val = event.target.value.trim()

      if (!val) return

      updateField(val)
    },
    [],
  )
  const handleEntryUpdateByKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== 13) return
      const val = event.currentTarget.value.trim()

      if (!val) return

      updateField(val)
    },
    [],
  )

  return (
    <div className={classes.fieldBar}>
      {showName
        ? <Typography variant="h5" className={classes.fieldName}>{fieldName}</Typography>
        : Icon && <Icon className={classes.fieldIcon} color="primary" />}
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
                <Eye className={classes.placeholderIcon} />
              </IconButton>
              <IconButton className={classes.fieldControlIcon}>
                <Reorder className={classes.placeholderIcon} />
              </IconButton>
              <IconButton className={classes.fieldControlIcon}>
                <AddCircle className={classes.placeholderIcon} />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export const ContactSelectedFieldInput: React.FC<SelectedInputProps> = React.memo(({
  fieldName = '', showName = false, Icon, editable, hasTitle, name, value, options, updateField,
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
        : Icon && <Icon className={classes.fieldIcon} color="primary" />}
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
                <Eye className={classes.placeholderIcon} />
              </IconButton>
              <IconButton className={classes.fieldControlIcon}>
                <Reorder className={classes.placeholderIcon} />
              </IconButton>
              <IconButton className={classes.fieldControlIcon}>
                <AddCircle className={classes.placeholderIcon} />
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
//         : Icon && <Icon className={classes.fieldIcon} color="primary" />}
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
//                 <AddCircle className={classes.placeholderIcon} />
//               </IconButton>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// })
