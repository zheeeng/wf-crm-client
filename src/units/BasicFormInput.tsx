import React, { useCallback } from 'react'
import classnames from 'classnames'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import { FilledInputClassKey } from '@material-ui/core/FilledInput/FilledInput'
import { TextFieldClassKey } from '@material-ui/core/TextField/TextField'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme: Theme) => ({
  text: {
    color: theme.palette.text.secondary,
  },
  input: {
    border: '1px solid rgba(163, 174, 173, 0.5)',
    height: theme.spacing.unit * 4,
    lineHeight: `${theme.spacing.unit * 4}px`,
    borderRadius: 2,
    padding: theme.spacing.unit,
    margin: 0,
    marginTop: theme.spacing.unit * 2,
    overflow: 'hidden',
  },
  formLabel: {
    fontSize: 14,
    color: theme.palette.grey.A400,
    transform: 'translate(0, 8px) scale(1)',
    paddingLeft: theme.spacing.unit,
  },
  shrink: {
    fontSize: 6,
    transform: 'translate(0, 4px) scale(1)',
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
      label={placeholder}
      value={value}
      onChange={onChange}
      margin="normal"
      fullWidth={fullWidth}
      InputProps={{
        onKeyDown: handleKeyDown,
        disableUnderline: true,
        classes: {
          ...InputClasses,
          root: classnames(classes.text, InputClasses && InputClasses.root),
        },
      }}
      InputLabelProps={{
        classes: {
          formControl: classes.formLabel,
          shrink: classes.shrink,
        },
      }}
    />
  )
})

export default BasicFormInput
