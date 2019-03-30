import React, { useCallback, useState } from 'react'
import classnames from 'classnames'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import { FilledInputClassKey } from '@material-ui/core/FilledInput/FilledInput'
import { TextFieldClassKey } from '@material-ui/core/TextField/TextField'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { useStyles } from './BasicFormInput'

export interface Props {
  className?: string,
  value?: string,
  options: Array<{ label: string, value: string }>,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  placeholder?: string,
  fullWidth?: boolean,
  InputClasses?: Partial<ClassNameMap<FilledInputClassKey>>
  TextFieldClasses?: Partial<ClassNameMap<TextFieldClassKey>>
}

const BasicFormInput: React.FC<Props> = React.memo(({
  placeholder = '', className, value = '', onChange, fullWidth = true, InputClasses, TextFieldClasses, options,
}) => {
  const classes = useStyles({})

  const [selected, setSelected] = useState(value)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelected(e.target.value)
      onChange && onChange(e)
    },
    [onchange]
  )

  return (
    <TextField
      select
      classes={TextFieldClasses}
      className={classnames(classes.inputWrapper, className)}
      label={placeholder}
      placeholder={placeholder}
      value={selected}
      onChange={handleChange}
      margin="normal"
      fullWidth={fullWidth}
      InputProps={{
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
    >
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
})

export default BasicFormInput
