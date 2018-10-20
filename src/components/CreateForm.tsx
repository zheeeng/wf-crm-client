import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BasicFormInput from '~src/units/BasicFormInput'
import cssTips from '~src/utils/cssTips'

import { WithContext } from '@roundation/store'
import notificationStore from '~src/services/notification'

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
})

export interface CreateFormOption {
  title?: string,
  fields?: string[],
  okText?: string,
  cancelText?: string
}

export interface Props extends WithStyles<typeof styles>, WithContext<typeof notificationStore, 'notificationStore'> {
  open: boolean,
  onClose?: React.ReactEventHandler<{}>,
  option?: CreateFormOption
}

class CreateForm extends React.PureComponent<Props> {
  fieldValues = {}

  handleCreateInfoChange = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.fieldValues[field] = e.target.value
    }

  onOk = () => {
    this.props.notificationStore.handleOpen('Success create a new Contact!')
  }

  render () {
    const { option, open, onClose, classes } = this.props

    const { title = 'title', fields = [], okText = 'Ok', cancelText = 'cancel' } = option || {}

    return (
      <Modal
        open={open}
        onClose={onClose}
      >
        <div className={classes.paper}>
          <Typography variant="subtitle1" align="center">
            {title}
          </Typography>
          {fields.map(field => (
            <BasicFormInput
              key={field}
              placeholder={field}
              onChange={this.handleCreateInfoChange(field)}
            />
          ))}
          <div className={classes.buttonZone}>
            <Button onClick={onClose}>{cancelText}</Button>
            <Button color="primary" onClick={this.onOk}>{okText}</Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default notificationStore.connect(withStyles(styles)(CreateForm), 'notificationStore')
