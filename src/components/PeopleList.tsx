import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import Avatar from '@material-ui/core/Avatar'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import cssTips from '~src/utils/cssTips'
import { Contact } from '~src/types/Contact'

import StarBorder from '@material-ui/icons/StarBorder'
import CallMerge from '@material-ui/icons/CallMerge'
import ScreenShare from '@material-ui/icons/ScreenShare'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Delete from '@material-ui/icons/Delete'

import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import CreateContactForm from '~src/components/CreateContactForm'
import Searcher from '~src/units/Searcher'
import MaterialIcon from '~src/units/MaterialIcon'

const styles = (theme: Theme) => createStyles({
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 4,
    whiteSpace: 'nowrap',
    [theme.breakpoints.between('sm', 'md')]: {
      ...cssTips(theme, { sizeFactor: 4 }).horizontallySpaced,
    },
    [theme.breakpoints.up('md')]: {
      ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced,
    },
  },
  table: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  search: {
    flex: 1,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  button: {
    borderRadius: theme.spacing.unit * 2,
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

  private handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchText: e.target.value,
    })
  }

  private handleItemClick = (id: string) => () => {
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

  private handleToggleAllChecked = () => {
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

  private handleStarClick = (id: string) => () => {
    //
  }

  private changeCreateFormOpened = (opened: boolean) => () => {
    this.setState({
      createFormOpened: opened,
    })
  }

  private renderPCLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell><Typography component="strong" variant="subtitle1">{contact.info.name}</Typography></TableCell>
      <TableCell>{contact.info.email}</TableCell>
      <TableCell>{contact.info.address}</TableCell>
      <TableCell numeric>{contact.info.telephone}</TableCell>
    </>
  )

  private renderTabletLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell><Typography component="strong" variant="subtitle1">{contact.info.name}</Typography></TableCell>
      <TableCell>
        <Typography>{contact.info.email}</Typography>
        <Typography>{contact.info.address}</Typography>
        <Typography>{contact.info.telephone}</Typography>
      </TableCell>
    </>
  )

  private renderMobileLayoutTableRows = (contact: Contact) => (
    <TableCell>
      <Typography component="strong" variant="subtitle1">{contact.info.name}</Typography>
      <Typography>{contact.info.email}</Typography>
      <Typography>{contact.info.address}</Typography>
      <Typography>{contact.info.telephone}</Typography>
    </TableCell>
  )

  private renderTableRows = (contact: Contact) => {
    const { classes } = this.props

    return (
      <TableRow key={contact.id} onClick={this.handleItemClick(contact.id)}>
        <TableCell padding="none" className={classes.minCell}>
          <Checkbox
            checked={this.state.checked.includes(contact.id)}
            tabIndex={-1}
          />
        </TableCell>
        <TableCell padding="none" className={classes.minCell}>
          <IconButton>
            <StarBorder
              color={contact.info.starred ? 'secondary' : 'primary'}
              onClick={this.handleStarClick(contact.id)}
            />
          </IconButton>
        </TableCell>
        <TableCell padding="none" className={classes.minCell}>
          <Avatar
            alt="Remy Sharp"
            src={contact.info.avatar}
          />
        </TableCell>
        <Hidden mdDown>
          {this.renderPCLayoutTableRows(contact)}
        </Hidden>
        <Hidden lgUp xsDown>
          {this.renderTabletLayoutTableRows(contact)}
        </Hidden>
        <Hidden smUp>
          {this.renderMobileLayoutTableRows(contact)}
        </Hidden>
      </TableRow>
    )
  }

  private renderSearcher = () => (
    <Searcher
      className={this.props.classes.search}
      value={this.state.searchText}
      onChange={this.handleSearchTextChange}
      placeholder="Type a name or email"
    />
  )

  render () {
    const { classes, contacts } = this.props
    const displayContacts = contacts.filter(contact =>
      [contact.info.name, contact.info.email].some(field => field.includes(this.state.searchText)),
    )

    return (
      <ContactTableThemeProvider>
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
          <Hidden smDown>
            {this.renderSearcher()}
          </Hidden>
          <Button color="primary">
            <MaterialIcon icon="CloudDownload" className={classes.leftIcon} />
            Download Plugin
          </Button>
        </div>
        <Hidden mdUp>
          <div className={classes.head}>
          {this.renderSearcher()}
          </div>
        </Hidden>
        <div className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none" className={classes.minCell}>
                  <Checkbox
                    checked={this.props.contacts.every(contact => this.state.checked.includes(contact.id))}
                    onClick={this.handleToggleAllChecked}
                  />
                </TableCell>
                <TableCell colSpan={6} padding="none">
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
                {displayContacts.map(this.renderTableRows)}
            </TableBody>
          </Table>
        </div>
      </ContactTableThemeProvider>
    )
  }
}

export default withStyles(styles)(MyCustomersIndex)
