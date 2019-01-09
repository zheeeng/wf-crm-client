import React, { useCallback } from 'react'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import { FilledInputClassKey } from '@material-ui/core/FilledInput/FilledInput'
import { TextFieldClassKey } from '@material-ui/core/TextField/TextField'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    border: '1px solid rgba(163, 174, 173, 0.5)',
    height: 32,
    lineHeight: 32,
    borderRadius: 2,
    padding: theme.spacing.unit,
    margin: 0,
    marginTop: theme.spacing.unit * 2,
  },
}))

export interface Props {
  value?: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  onEnterPress?: React.KeyboardEventHandler<HTMLInputElement>,
  placeholder?: string,
  fullWidth?: boolean,
  InputClasses?: Partial<ClassNameMap<FilledInputClassKey>>
  TextFieldClasses?: Partial<ClassNameMap<TextFieldClassKey>>
}

const BasicFormInput: React.FC<Props> = React.memo(({
  placeholder = '', value, onChange, onEnterPress, fullWidth = true, InputClasses, TextFieldClasses,
}) => {
  const classes = useStyles({})

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!onEnterPress) return

      event.keyCode === 13 && onEnterPress(event)
    },
    [onEnterPress],
  )

  return (
    <TextField
      classes={TextFieldClasses}
      className={classes.input}
      label={null}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      margin="normal"
      fullWidth={fullWidth}
      InputProps={{
        onKeyDown: handleKeyDown,
        disableUnderline: true,
        classes: InputClasses,
      }}
    />
  )
})

export default BasicFormInput
