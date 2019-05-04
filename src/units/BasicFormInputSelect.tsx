import React, { useCallback, useState } from 'react'
import Select, { createFilter } from 'react-select'
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    maxHeight: theme.spacing(24),
    overflow: 'auto',
  },
  noOptionsMessage: {
    fontSize: 14,
    padding: theme.spacing(1, 2),
  },
  placeholder: {
    color: theme.palette.grey.A400,
    position: 'absolute',
    left: 2,
    fontSize: 14,
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
  },
  option: {
    fontSize: 14,
    padding: theme.spacing(0.5, 1),
    margin: 0,
    color: theme.palette.text.secondary,
  },
  optionButtonHover: {
    '&&:hover': {
      backgroundColor: theme.palette.grey.A100,
    },
  },
  optionButtonSelected: {
    '&&': {
      backgroundColor: theme.palette.grey.A100,
    },
  },
}))

const useStyles3 = makeStyles((theme: Theme) => ({
  root: {
    '&&': {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(1),
    },
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
  disabled?: boolean,
}


const InputComponent: React.FC<{ inputRef: React.LegacyRef<HTMLDivElement> }>
  = ({ inputRef, ...props }) => <div ref={inputRef} {...props} />

const Control: React.FC<{
  hasValue: boolean,
  innerRef: React.Ref<HTMLDivElement>,
  selectProps: { props: Partial<Pick<Props, 'className' | 'placeholder'  | 'InputClasses' | 'error' | 'fullWidth' | 'TextFieldClasses'> & { isSimple: boolean }> },
  innerProps: any,
}>
  = React.memo(({
    innerRef,
    selectProps: { props: { className, placeholder, InputClasses, error, fullWidth = true, TextFieldClasses, isSimple = false } },
    innerProps,
    children,
  }) => {
    const classes = useStyles({})
    const classes3 = useStyles3({})

    return (
      <TextField
        autoComplete="no"
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
              isSimple ? classes3.root : classes.root,
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
        classes={{
            root: classes.optionButtonHover,
            selected: classes.optionButtonSelected,
        }}
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
        {...innerProps}
      >
        {children}
      </MenuItem>
    )
  }

export const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
  IndicatorSeparator: null,
  IndicatorsContainer,
}

export const filterOption = createFilter({
  ignoreCase: true,
  ignoreAccents: true,
  trim: true,
  matchFrom: 'start',
})

const BasicFormInputSelect: React.FC<Props> = React.memo(({
  placeholder = '', className, value = '', error, onChange, fullWidth = true, InputClasses, TextFieldClasses, options, disabled,
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
      className={classnames(classes2.select, className)}
      classes={classes}
      options={options}
      components={components}
      onChange={handleChange}
      placeholder={placeholder}
      props={{
        TextFieldClasses,
        fullWidth,
        InputClasses,
        placeholder,
        error,
      }}
      filterOption={filterOption}
      isDisabled={disabled}
    />
  )
})


export const SimpleFormInputSelect: React.FC<Props> = React.memo(({
  placeholder = '', className, value = '', error, onChange, fullWidth = true, InputClasses, TextFieldClasses, options, disabled,
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
      className={classnames(classes2.select, className)}
      classes={classes}
      options={options}
      components={components}
      onChange={handleChange}
      placeholder={placeholder}
      props={{
        TextFieldClasses,
        fullWidth,
        InputClasses,
        error,
        isSimple: true,
      }}
      filterOption={filterOption}
      isDisabled={disabled}
    />
  )
})

export default BasicFormInputSelect
