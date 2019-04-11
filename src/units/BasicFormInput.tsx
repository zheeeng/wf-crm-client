import React, { useCallback } from 'react'
import classnames from 'classnames'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import { FilledInputClassKey } from '@material-ui/core/FilledInput/FilledInput'
import { TextFieldClassKey } from '@material-ui/core/TextField/TextField'
import TextField from '@material-ui/core/TextField'

export const useStyles = makeStyles((theme: Theme) => ({
  text: {
    color: theme.palette.text.secondary,
  },
  root: {
    '&&': {
      marginTop: theme.spacing(1.5),
    }
  },
  inputWrapper: {
    border: '1px solid rgba(163, 174, 173, 0.5)',
    borderRadius: 2,
    padding: theme.spacing(0, 1),
  },
  formItem: {
    padding: theme.spacing(0.5),
  },
  formLabel: {
    fontSize: 14,
    paddingTop: theme.spacing(0.5),
    color: theme.palette.grey.A400,
    transform: `translate(0, ${theme.spacing(1)}px) scale(1)`,
    paddingLeft: theme.spacing(1),
  },
  input: {
    display: 'flex',
    padding: 0,
    fontWeight: 500,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  shrink: {
    fontSize: 8,
    transform: `translate(0, 0) scale(1)`,
  },
}))

export interface Props {
  className?: string,
  type?: string,
  style?: React.CSSProperties,
  value?: string,
  error?: boolean,
  onChange?: React.ChangeEventHandler<HTMLElement>,
  onEnterPress?: React.KeyboardEventHandler<HTMLInputElement>,
  autoFocus?: boolean,
  placeholder?: string,
  noLabel?: boolean,
  fullWidth?: boolean,
  InputClasses?: Partial<ClassNameMap<FilledInputClassKey>>
  TextFieldClasses?: Partial<ClassNameMap<TextFieldClassKey>>
}

const BasicFormInput: React.FC<Props> = React.memo(({
  autoFocus = false, placeholder = '', noLabel, className, style, value, type, error, onChange, onEnterPress, fullWidth = true, InputClasses, TextFieldClasses,
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
      autoFocus={autoFocus}
      type={type}
      error={error}
      style={style}
      classes={TextFieldClasses}
      className={classnames(classes.inputWrapper, className)}
      label={noLabel ? undefined : placeholder}
      placeholder={noLabel ? placeholder : undefined}
      defaultValue={value}
      onChange={onChange}
      margin="normal"
      fullWidth={fullWidth}
      InputProps={{
        onKeyDown: handleKeyDown,
        disableUnderline: true,
        classes: {
          ...InputClasses,
          root: classnames(
            classes.text,
            classes.root,
            InputClasses && InputClasses.root,
          ),
          input: classnames(
            classes.input,
            InputClasses && InputClasses.input,
          ),
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
