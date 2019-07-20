import React, { useState, useEffect, useCallback } from 'react'
import classnames from 'classnames'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import DatePickerThemeProvider from '~src/theme/DatePickerThemeProvider'

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
  className?: string
  date: Date | null
  onDateChange: (date: Date | null) => void
  disabled?: boolean
  placeholder?: string
}

const BasicDateInput: React.FC<Props> = React.memo(({ className, placeholder, date, onDateChange, disabled }) => {
  const classes = useStyles()

  const [localDate, setLocalDate] = useState(date)

  useEffect(
    () => {
      setLocalDate(date)
    },
    [setLocalDate, date]
  )

  const submitLocalDate = useCallback(
    (date: Date | null) => {
      onDateChange(date)
    },
    [onDateChange]
  )

  return (
    <DatePickerThemeProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          views={["day", "month", "year"]} format="dd/MM/yyyy"
          className={classnames(className, classes.datePicker, disabled && classes.disabled)}
          margin="normal"
          InputProps={{
            placeholder: placeholder,
          }}
          value={localDate ? localDate : null}
          onChange={setLocalDate}
          onAccept={submitLocalDate}
          clearable
          clearLabel={<Typography color="secondary">Clear</Typography>}
          cancelLabel={<Typography color="secondary">Cancel</Typography>}
          okLabel={<Typography color="primary">OK</Typography>}
        />
      </MuiPickersUtilsProvider>
    </DatePickerThemeProvider>
  )
})

export default BasicDateInput
