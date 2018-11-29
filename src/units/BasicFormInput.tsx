import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
  input: {
    border: '1px solid rgba(163, 174, 173, 0.5)',
    height: 32,
    lineHeight: 32,
    borderRadius: 2,
    padding: '7.7px 32.8px 5.3px 8px',
    margin: '14px 0 0 0',
  },
})

export interface Props {
  value?: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  onEnterPress?: React.KeyboardEventHandler<HTMLInputElement>,
  placeholder?: string,
}

const BasicFormInput: React.FC<Props> = React.memo(({ placeholder = '', value, onChange, onEnterPress }) => {
  const classes = useStyles({})

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!onEnterPress) return

      if (event.keyCode !== 13) return
      onEnterPress(event)
    },
    [onEnterPress],
  )

  return (
    <TextField
      className={classes.input}
      label={null}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      margin="normal"
      fullWidth
      InputProps={{
        disableUnderline: true,
      }}
      onKeyDown={handleKeyDown}
    />
  )
})

export default BasicFormInput
