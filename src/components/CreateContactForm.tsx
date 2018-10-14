import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import BasicFormInput from '~src/units/BasicFormInput'
import cssTips from '~src/utils/cssTips'

const styles = (theme: Theme) => createStyles({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    border: 'none',
    outline: '#efefef inset 1px',
  },
  buttonZone: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 4,
    ...cssTips(theme).horizontallySpaced,
  },
  createButton: {
    color: theme.palette.primary.main,
  },
})

export interface Props extends WithStyles<typeof styles> {
  fields: string[],
  open: boolean,
  onClose?: React.ReactEventHandler<{}>,
}

class CreateContactForm extends React.PureComponent<Props> {
  fieldValues = {}

  handleCreateInfoChange = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.fieldValues[field] = e.target.value
    }

  render () {
    const { fields, open, onClose, classes } = this.props

    return (
      <Modal
        open={open}
        onClose={onClose}
      >
        <div className={classes.paper}>
          <Typography variant="subtitle1" align="center">
            New Contact
          </Typography>
          {fields.map(field => (
            <BasicFormInput
              key={field}
              placeholder={field}
              onChange={this.handleCreateInfoChange(field)}
            />
          ))}
          <div className={classes.buttonZone}>
            <a onClick={onClose}>Cancel</a>
            <a className={classes.createButton}>Create</a>
          </div>
        </div>
      </Modal>
    )
  }
}

export default withStyles(styles)(CreateContactForm)
