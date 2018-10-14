import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const styles = (theme: Theme) => createStyles({
  input: {
    border: '1px solid rgba(163, 174, 173, 0.5)',
    height: 32,
    lineHeight: 32,
    borderRadius: 2,
    padding: '7.7px 32.8px 5.3px 8px',
    margin: '14px 0 0 0',
  },
})

export interface Props extends WithStyles<typeof styles> {
  value?: string,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  placeholder?: string,
}

class BasicFormInput extends React.PureComponent<Props> {
  render () {
    const { placeholder = '', value, onChange, classes } = this.props

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
      />
    )
  }
}

export default withStyles(styles)(BasicFormInput)
