import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountCircle from '@material-ui/icons/AccountCircle'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import Avatar from '@material-ui/core/Avatar'
import Star from '@material-ui/icons/Star'
import cssTips from '~src/utils/cssTips'
import { Contact } from '~src/types/Contact'

import CallMerge from '@material-ui/icons/CallMerge'
import ScreenShare from '@material-ui/icons/ScreenShare'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Delete from '@material-ui/icons/Delete'

import CreateContactForm from '~src/components/CreateContactForm'

const styles = (theme: Theme) => createStyles({
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 2,
    ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced,
  },
  table: {
    flexGrow: 1,
    overflowY: 'auto',
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
  minCell: {
    width: '1%',
  },
})

export interface Props extends WithStyles<typeof styles> {
  contacts: Contact[]
}

export interface State {
  checked: string[]
  createFormOpened: boolean
  searchText: string
}

class MyCustomersIndex extends React.Component<Props, State> {
  state: State = {
    checked: [],
    createFormOpened: false,
    searchText: '',
  }

  handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchText: e.target.value,
    })
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

  changeCreateFormOpened = (opened: boolean) => () => {
    this.setState({
      createFormOpened: opened,
    })
  }

  render () {
    const { classes } = this.props

    return (
      <>
        <CreateContactForm
          fields={['First name', 'Last name', 'Email', 'Phone']}
          open={this.state.createFormOpened}
          onClose={this.changeCreateFormOpened(false)}
        />
        <div className={classes.head}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={this.changeCreateFormOpened(true)}
          >New contact</Button>
          <OutlinedInput
            className={classes.search}
            classes={{ notchedOutline: classes.button }}
            labelWidth={300}
            notched={false}
            value={this.state.searchText}
            onChange={this.handleSearchTextChange}
            placeholder="Type a name or email"
            startAdornment={(
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            )}
          />
          <div>Download Plugin</div>
        </div>
        <div className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={this.props.contacts.every(contact => this.state.checked.includes(contact.id))}
                    onClick={this.handleToggleAllChecked}
                  />
                </TableCell>
                <TableCell colSpan={6} padding="checkbox">
                  <IconButton>
                    <ScreenShare />
                  </IconButton>
                  <IconButton>
                    <CallMerge />
                  </IconButton>
                  <IconButton>
                    <PersonAdd onClick={this.changeCreateFormOpened(true)} />
                  </IconButton>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.contacts
                .filter(
                  contact => [contact.info.name, contact.info.email]
                    .some(field => field.includes(this.state.searchText)),
                )
                .map(contact => (
                <TableRow key={contact.id} onClick={this.handleItemClick(contact.id)}>
                  <TableCell padding="checkbox" className={classes.minCell}>
                    <Checkbox
                      checked={this.state.checked.includes(contact.id)}
                      tabIndex={-1}
                    />
                  </TableCell>
                  <TableCell padding="checkbox" className={classes.minCell}>
                    <IconButton>
                      <Star
                        color={contact.info.starred ? 'secondary' : 'primary'}
                        onClick={this.handleStarClick(contact.id)}
                      />
                    </IconButton>
                  </TableCell>
                  <TableCell padding="checkbox" className={classes.minCell}>
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
        </div>
      </>
    )
  }
}

export default withStyles(styles)(MyCustomersIndex)
