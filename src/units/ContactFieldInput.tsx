import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import AddCircle from '@material-ui/icons/AddCircle'
import cssTips from '~src/utils/cssTips'
import { FSA } from '~src/types/FSA'

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

export interface ValueAndNote {
  value: string
  note?: string
}

export interface Props {
  Icon?: React.ComponentType<{ className?: string, color?: any }>,
  key: string | number,
  name: string,
  valueAndNote: ValueAndNote | ValueAndNote[],
  editable?: boolean,
  onDraftChange?: (name: string, valueAndNote: ValueAndNote | ValueAndNote[]) => void,
  placeholder?: string,
  notePlaceholder?: string,
}

const reducer = (
  state: ValueAndNote[],
  action: FSA<'add'>
    | FSA<'changeValue', { index: number, value: string }>
    | FSA<'changeNote', { index: number, value: string }>,
) => {
  switch (action.type) {
    case 'add': {
      return state.concat({ value: '', note: state[0].note === undefined ? undefined : '' })
    }
    case 'changeValue': {
      return state.map((pair, i) => i === action.payload.index ? { ...pair, value: action.payload.value } : pair)
    }
    case 'changeNote': {
      return state.map((pair, i) => i === action.payload.index ? { ...pair, note: action.payload.value } : pair)
    }
    default: {
      return state
    }
  }
}

const ContactFieldInput: React.FC<Props> = React.memo(props => {
  const classes = useStyles({})
  const { Icon, name, valueAndNote, editable = false, onDraftChange, placeholder, notePlaceholder } = props

  const expandable = React.useMemo(() => Array.isArray(valueAndNote), [valueAndNote])
  const valueAndNotes = React.useMemo(() => ([] as ValueAndNote[]).concat(valueAndNote), [valueAndNote])

  const [ localValueAndNotes, dispatch ] = React.useReducer(reducer, valueAndNotes)

  const handleAddEntry = React.useCallback(
    () => dispatch({ type: 'add' }),
    [valueAndNotes],
  )

  const handleEntryChange = React.useCallback(
    (type: 'changeValue' | 'changeNote', index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'changeValue') return dispatch({ type, payload: { index, value: event.target.value } })

      return dispatch({ type, payload: { index, value: event.target.value } })
    },
    [valueAndNotes],
  )

  React.useEffect(() => {
    if (!onDraftChange) return

    onDraftChange(name, expandable ? localValueAndNotes : localValueAndNotes[0])
  })

  return (
    <div className={classes.fieldBar}>
      {Icon && <Icon className={classes.fieldIcon} color="primary" />}
      <div className={classes.fieldTextWrapper}>
        {localValueAndNotes.map((pair, index) => (
          <div className={classes.fieldTextBar} key={index}>
            <Input
              disabled={!editable}
              disableUnderline={!editable}
              className={classes.fieldInput}
              placeholder={placeholder}
              value={pair.value}
              onChange={handleEntryChange('changeValue', index)}
              startAdornment={
                (pair.note === undefined || editable)
                  ? undefined
                  : <strong className={classes.fieldTypeText}>{pair.note}</strong>
              }
            />
            {(pair.note !== undefined && editable) ? (
              <Input
                className={classes.fieldTypeText}
                value={pair.note}
                onChange={handleEntryChange('changeNote', index)}
                placeholder={notePlaceholder}
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
