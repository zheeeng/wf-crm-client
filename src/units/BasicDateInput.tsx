import React, { useState, useEffect, useCallback } from 'react'
import classnames from 'classnames'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from 'material-ui-pickers'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import DatePickerThemeProvider from '~src/theme/DatePickerThemeProvider'
import { getPlaceholderDate } from '~src/utils/getDate'

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
}

const isInvalidDate = (date: Date | null) => isNaN(date as any)

const BasicDateInput: React.FC<Props> = React.memo(({ className, date, onDateChange, disabled }) => {
  const classes = useStyles()

  const [localDate, setLocalDate] = useState(date)

  useEffect(
    () => {
      setLocalDate(date)
    },
    [setLocalDate, date]
  )

  const handleChange = useCallback(
    (date: Date | null) => { setLocalDate(date) },
    [],
  )

  const submitLocalDate = useCallback(
    (date: Date | null) => {
      if (isInvalidDate(date)) return

      onDateChange(date)
    },
    [onDateChange],
  )

  const submitLocalDataByBlur = useCallback(
    () => {
      if (isInvalidDate(localDate)) return

      onDateChange(localDate)
    },
    [localDate, onDateChange],
  )

  const submitLocalDataByKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== 13) return
      if (isInvalidDate(localDate)) return

      onDateChange(localDate)

    },
    [localDate, onDateChange],
  )

  return (
    <DatePickerThemeProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          views={["day", "month", "year"]} format="dd/MM/yyyy"
          placeholder={getPlaceholderDate()}
          className={classnames(className, classes.datePicker, disabled && classes.disabled)}
          margin="normal"
          // InputProps={{
          //   placeholder: placeholder,
          // }}
          value={localDate ? localDate : null}
          onChange={handleChange}
          onBlur={submitLocalDataByBlur}
          onKeyDown={submitLocalDataByKeydown}
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
