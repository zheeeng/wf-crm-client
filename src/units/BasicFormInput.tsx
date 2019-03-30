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
      marginTop: theme.spacing.unit * 1.5,
    }
  },
  inputWrapper: {
    border: '1px solid rgba(163, 174, 173, 0.5)',
    borderRadius: 2,
    padding: `0 ${theme.spacing.unit}px`,
  },
  formItem: {
    padding: theme.spacing.unit / 2,
  },
  formLabel: {
    fontSize: 14,
    paddingTop: theme.spacing.unit / 2,
    color: theme.palette.grey.A400,
    transform: `translate(0, ${theme.spacing.unit}px) scale(1)`,
    paddingLeft: theme.spacing.unit,
  },
  input: {
    padding: 0,
    fontWeight: 600,
    marginTop: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  shrink: {
    fontSize: 8,
    transform: `translate(0, 0) scale(1)`,
  },
}))

export interface Props {
  className?: string,
  style?: React.CSSProperties,
  value?: string,
  onChange?: React.ChangeEventHandler<HTMLElement>,
  onEnterPress?: React.KeyboardEventHandler<HTMLInputElement>,
  placeholder?: string,
  noLabel?: boolean,
  fullWidth?: boolean,
  InputClasses?: Partial<ClassNameMap<FilledInputClassKey>>
  TextFieldClasses?: Partial<ClassNameMap<TextFieldClassKey>>
}

const BasicFormInput: React.FC<Props> = React.memo(({
  placeholder = '', noLabel, className, style, value, onChange, onEnterPress, fullWidth = true, InputClasses, TextFieldClasses,
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
          input: classes.input,
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
