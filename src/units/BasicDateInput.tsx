import React from 'react'
import classnames from 'classnames'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker as DP } from 'material-ui-pickers'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import DatePickerThemeProvider from '~src/theme/DatePickerThemeProvider'

const DatePicker = DP as any

export const useStyles = makeStyles((theme: Theme) => ({
  datePicker: {
    color: theme.palette.text.secondary,
    '& div': {
      color: 'unset',
    },
  },
  disabled: {
    pointerEvent: 'none',
  },
}))

export interface Props {
  className?: string,
  date: Date | null,
  onDateChange: (date: Date | null) => void
  disabled?: boolean,
  placeholder?: string,
}

const BasicDateInput: React.FC<Props> = React.memo(({ className, placeholder, date, onDateChange, disabled }) => {
  const classes = useStyles()

  return (
    <DatePickerThemeProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          variant="inline"
          views={["day", "month", "year"]} format="dd/MM/yyyy"
          className={classnames(className, classes.datePicker, disabled && classes.disabled)}
          margin="normal"
          InputProps={{
            placeholder: placeholder,
          }}
          value={date ? date : null}
          onChange={onDateChange}
        />
      </MuiPickersUtilsProvider>
    </DatePickerThemeProvider>
  )
})

export default BasicDateInput
