import React, { useCallback, useState } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import { FilledInputClassKey } from '@material-ui/core/FilledInput/FilledInput'
import { TextFieldClassKey } from '@material-ui/core/TextField/TextField'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import { useStyles } from './BasicFormInput'


export const useStyles2 = makeStyles((theme: Theme) => ({
  select: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    maxHeight: theme.spacing.unit * 20,
    overflow: 'auto',
  },
  noOptionsMessage: {
    fontSize: 14,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  placeholder: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  singleValue: {
    fontSize: 16,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    marginTop: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  option: {
    backgroundColor: 'white',
    fontSize: 14,
    padding: theme.spacing.unit,
    margin: 0,
    color: theme.palette.text.secondary,
  },
}))

export interface Props {
  className?: string,
  value?: string,
  error?: boolean,
  options: Array<{ label: string, value: string }>,
  onChange?: (value: string) => void,
  placeholder?: string,
  fullWidth?: boolean,
  InputClasses?: Partial<ClassNameMap<FilledInputClassKey>>
  TextFieldClasses?: Partial<ClassNameMap<TextFieldClassKey>>
}


const InputComponent: React.FC<{ inputRef: React.LegacyRef<HTMLDivElement> }>
  = ({ inputRef, ...props }) => <div ref={inputRef} {...props} />

const Control: React.FC<{
  hasValue: boolean,
  innerRef: React.Ref<HTMLDivElement>,
  selectProps: { props: Pick<Props, 'className' | 'placeholder'  | 'InputClasses' | 'error' | 'fullWidth' | 'TextFieldClasses'> },
  innerProps: any,
}>
  = React.memo(({
    innerRef,
    selectProps: { props: { className, placeholder, InputClasses, error, fullWidth = true, TextFieldClasses } },
    innerProps,
    children,
  }) => {
    const classes = useStyles({})

    return (
      <TextField
        error={error}
        classes={TextFieldClasses}
        className={classnames(classes.inputWrapper, className)}
        fullWidth={fullWidth}
        InputProps={{
          inputComponent: InputComponent,
          inputRef: innerRef,
          inputProps: {
            className: classes.input,
            children: children,
          },
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
          ...innerProps,
        }}
        InputLabelProps={{
          shrink: true,
          classes: {
            formControl: classes.formLabel,
            shrink: classes.shrink,
          },
        }}
        label={placeholder}
      />
    )
  })

const Menu: React.FC<{ innerProps: any }> = ({ children,innerProps }) => {
  const classes = useStyles2({})

  return (
    <Paper square className={classes.paper} {...innerProps}>
      {children}
    </Paper>
  )
}

const NoOptionsMessage: React.FC<{ innerProps: any }> = ({ children, innerProps }) => {
  const classes = useStyles2({})

  return (
    <Typography
      color="textSecondary"
      className={classes.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  )
}

const Placeholder: React.FC<{ innerProps: any }> = ({ children, innerProps }) => {
  const classes = useStyles2({})

  return (
    <Typography
      color="textSecondary"
      className={classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  )
}

const ValueContainer: React.FC = ({ children }) => {
  const classes = useStyles2({})

  return (
    <div className={classes.valueContainer}>{children}</div>
  )
}

const IndicatorsContainer: React.FC = ({ children }) => (
  <ArrowDropDown />
)

const Option: React.FC<{ innerRef: React.Ref<any>, isSelected: boolean, isFocused: boolean, innerProps: any }>
  = ({ innerRef, isSelected, isFocused, children, innerProps }) => {
    const classes = useStyles2({})

    return (
      <MenuItem
        buttonRef={innerRef}
        selected={isFocused}
        component="div"
        className={classes.option}
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
        {...innerProps}
      >
        {children}
      </MenuItem>
    )
  }

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
  IndicatorSeparator: null,
  IndicatorsContainer,
}

const BasicFormInput: React.FC<Props> = React.memo(({
  placeholder = '', className, value = '', error, onChange, fullWidth = true, InputClasses, TextFieldClasses, options,
}) => {
  const classes = useStyles({})
  const classes2 = useStyles2({})

  const handleChange = useCallback(
    (input: any) => {

      onChange && input && input.value && onChange((input as { value: string, label: string }).value)
    },
    [onchange]
  )

  return (
    <Select
      className={classes2.select}
      classes={classes}
      options={options}
      components={components}
      onChange={handleChange}
      placeholder={placeholder}
      props={{
        TextFieldClasses,
        fullWidth,
        className,
        InputClasses,
        placeholder,
        error,
      }}
    />
  )
})

export default BasicFormInput
