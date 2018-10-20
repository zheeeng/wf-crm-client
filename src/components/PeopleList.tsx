import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
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
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 3,
    whiteSpace: 'nowrap',
    [theme.breakpoints.between('sm', 'md')]: {
      ...cssTips(theme, { sizeFactor: 4 }).horizontallySpaced,
    },
    [theme.breakpoints.up('md')]: {
      ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced,
    },
  },
  alignRight: {
    '$head&': {
      justifyContent: 'flex-end',
    },
  },
  paginationIconButton: {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.action.active,
    padding: 0,
    margin: theme.spacing.unit * 1.5,
    borderRadius: '50%',
    ['&:hover']: {
      backgroundColor: theme.palette.action.hover,
    },
  },
  disabled: {
    '$paginationIconButton&': {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.action.disabled,
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
  minCell: {
    width: '1%',
  },
  w10Cell: {
    width: '10%',
  },
  w15Cell: {
    width: '15%',
  },
  w20Cell: {
    width: '20%',
  },
  w25Cell: {
    width: '25%',
  },
})

export interface Props extends WithStyles<typeof styles> {
  contacts: Contact[]
}

export interface State {
  checked: string[]
  createFormOpened: boolean
  searchText: string
  page: number
}

class PeopleList extends React.Component<Props, State> {
  state: State = {
    checked: [],
    createFormOpened: false,
    searchText: '',
    page: 1,
  }

  private get rowsPerPage () {
    return 10
  }

  private handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchText: e.target.value,
      page: 0,
      checked: [],
    })
  }

  private handleChangePage = (_: any, page: number) => {
    this.setState({ page })
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
      <TableCell className={this.props.classes.w15Cell}>
        <Typography component="strong" variant="subtitle1">{contact.info.name}</Typography>
      </TableCell>
      <TableCell className={this.props.classes.w20Cell}>{contact.info.email}</TableCell>
      <TableCell className={this.props.classes.w25Cell}>{contact.info.address}</TableCell>
      <TableCell numeric>{contact.info.telephone}</TableCell>
    </>
  )

  private renderTabletLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell className={this.props.classes.w25Cell}>
        <Typography component="strong" variant="subtitle1">{contact.info.name}</Typography>
      </TableCell>
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

  private get filteredContacts () {
    const { searchText } = this.state

    if (!searchText) return this.props.contacts

    return this.props.contacts
      .filter(contact =>
        [contact.info.name, contact.info.email].some(field => field.includes(searchText)),
      )
  }

  private get displayContacts () {
    const startIndex = this.state.page * this.rowsPerPage
    const endIndex = startIndex + this.rowsPerPage

    return this.filteredContacts.slice(startIndex, endIndex)
  }

  private renderLabelDisplayedRows = ({ from, to, count }: { from: number, to: number, count: number }) =>
    `${from.toLocaleString('en-IN')} - ${to.toLocaleString('en-IN')} of ${count.toLocaleString('en-IN')}`

  private renderPagination = (inTable: boolean = false) => (
    <TablePagination
      component={inTable ? undefined : 'div'}
      count={this.filteredContacts.length}
      rowsPerPage={this.rowsPerPage}
      page={this.state.page}
      backIconButtonProps={{
        className: classNames([
          this.props.classes.paginationIconButton,
          this.state.page === 0 && this.props.classes.disabled,
        ]),
        ['aria-label']: 'Previous Page',
      }}
      nextIconButtonProps={{
        className: classNames([
          this.props.classes.paginationIconButton,
          this.state.page === ~~(this.filteredContacts.length / this.rowsPerPage) && this.props.classes.disabled,
        ]),
        ['aria-label']: 'Next Page',
      }}
      onChangePage={this.handleChangePage}
      labelDisplayedRows={this.renderLabelDisplayedRows}
      rowsPerPageOptions={[]}
    />
  )

  render () {
    const { classes, contacts } = this.props
    const displayContacts = this.displayContacts
    const { checked: checkedContacts } = this.state

    return (
      <ContactTableThemeProvider>
        <CreateContactForm
          fields={['First name', 'Last name', 'Email', 'Phone']}
          open={this.state.createFormOpened}
          onClose={this.changeCreateFormOpened(false)}
        />
        <div className={classes.head}>
          <Button
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
        <Hidden mdUp>
          <div className={classNames([classes.head, classes.alignRight])}>
            {this.renderPagination()}
          </div>
        </Hidden>
        <div className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none" className={classes.minCell}>
                  <Checkbox
                    checked={contacts.every(contact => checkedContacts.includes(contact.id))}
                    onClick={this.handleToggleAllChecked}
                  />
                </TableCell>
                <TableCell colSpan={3} padding="none">
                  {checkedContacts.length > 0 && (
                    <>
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
                    </>
                  )}
                </TableCell>
                <Hidden smDown>
                  {this.renderPagination(true)}
                </Hidden>
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

export default withStyles(styles)(PeopleList)
