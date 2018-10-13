import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountCircle from '@material-ui/icons/AccountCircle'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import Star from '@material-ui/icons/Star'
import cssTips from '~src/utils/cssTips'
import { Contact } from '~src/types/Contact'

import CallMerge from '@material-ui/icons/CallMerge'
import ScreenShare from '@material-ui/icons/ScreenShare'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Delete from '@material-ui/icons/Delete'

import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'

const styles = (theme: Theme) => createStyles({
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 2,
    ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced,
  },
  search: {
    flex: 1,
  },
  button: {
    borderRadius: theme.spacing.unit * 2,
  },
  avatar: {
    height: 32,
    width: 32,
  },
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
})

export interface Props extends WithStyles<typeof styles> {
  contacts: Contact[]
}

export interface State {
  checked: string[]
  createModalOpened: boolean
  name: string,
  email: string,
  address: string,
  telephone: string
}

class MyCustomersIndex extends React.Component<Props, State> {
  state: State = {
    checked: [],
    createModalOpened: false,
    name: '',
    email: '',
    address: '',
    telephone: '',
  }

  handleItemClick = (id: string) => () => {
    const { checked } = this.state
    const currentIndex = checked.indexOf(id)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(id)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    this.setState({
      checked: newChecked,
    })
  }

  handleToggleAllChecked = () => {
    if (this.state.checked.length) {
      this.setState({
        checked: [],
      })
    } else {
      this.setState({
        checked: this.props.contacts.map(contact => contact.id),
      })
    }
  }

  handleStarClick = (id: string) => () => {
    //
  }

  changeCreateModalOpened = (opened: boolean) => () => {
    this.setState({
      createModalOpened: opened,
    })
  }

  render () {
    const { classes } = this.props

    return (
      <>
        <Modal
          open={this.state.createModalOpened}
          onClose={this.changeCreateModalOpened(false)}
        >
          <div className={classes.paper}>
            <Typography variant="title" align="center">
              New Contact
            </Typography>
            <TextField
              label="name"
              value={this.state.name}
              margin="normal"
              fullWidth
              // variant="outlined"
              InputProps={{
                disableUnderline: true,
              }}
            />
            <TextField
              label="email"
              value={this.state.email}
              margin="normal"
              fullWidth
              // variant="outlined"
              InputProps={{
                disableUnderline: true,
              }}
            />
            <TextField
              label="address"
              value={this.state.address}
              margin="normal"
              fullWidth
              // variant="outlined"
              InputProps={{
                disableUnderline: true,
              }}
            />
            <TextField
              label="telephone"
              value={this.state.telephone}
              margin="normal"
              fullWidth
              // variant="outlined"
              InputProps={{
                disableUnderline: true,
              }}
            />
            <div style={{ textAlign: 'right' }}>
              <a
                style={{ marginRight: 24 }}
                onClick={this.changeCreateModalOpened(false)}
              >Cancel</a>
              <a>Create</a>
            </div>
          </div>
        </Modal>
        <div className={classes.head}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={this.changeCreateModalOpened(true)}
          >New contact</Button>
          <OutlinedInput
            className={classes.search}
            classes={{ notchedOutline: classes.button }}
            labelWidth={300}
            notched={false as any}
            placeholder="Type a name or email"
            startAdornment={(
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            )}
          />
          <div>Download Plugin</div>
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell padding="dense">
                <Checkbox
                  checked={this.props.contacts.every(contact => this.state.checked.includes(contact.id))}
                  onClick={this.handleToggleAllChecked}
                />
              </TableCell>
              <TableCell colSpan={6}>
                <IconButton>
                  <ScreenShare />
                </IconButton>
                <IconButton>
                  <CallMerge />
                </IconButton>
                <IconButton>
                  <PersonAdd onClick={this.changeCreateModalOpened(true)} />
                </IconButton>
                <IconButton>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
            {this.props.contacts.map(contact => (
              <TableRow key={contact.id} onClick={this.handleItemClick(contact.id)}>
                <TableCell padding="dense">
                  <Checkbox
                    checked={this.state.checked.includes(contact.id)}
                    tabIndex={-1}
                  />
                </TableCell>
                <TableCell padding="dense">
                  <IconButton>
                    <Star
                      color={contact.info.starred ? 'secondary' : 'primary'}
                      onClick={this.handleStarClick(contact.id)}
                    />
                  </IconButton>
                </TableCell>
                <TableCell padding="dense">
                  <Avatar
                    alt="Remy Sharp"
                    className={classes.avatar}
                    src={contact.info.avatar}
                  />
                </TableCell>
                <TableCell>{contact.info.name}</TableCell>
                <TableCell>{contact.info.email}</TableCell>
                <TableCell>{contact.info.address}</TableCell>
                <TableCell numeric>{contact.info.telephone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    )
  }
}

export default withStyles(styles)(MyCustomersIndex)
