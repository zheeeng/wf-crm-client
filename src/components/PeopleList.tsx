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
import Popover from '@material-ui/core/Popover'
import cssTips from '~src/utils/cssTips'
import { Contact, ApiContact } from '~src/types/Contact'

import StarBorder from '@material-ui/icons/StarBorder'
import CallMerge from '@material-ui/icons/CallMerge'
import ScreenShare from '@material-ui/icons/ScreenShare'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Delete from '@material-ui/icons/Delete'

import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import CreateForm, { CreateFormOption } from '~src/components/CreateForm'
import TablePaginationActions from '~src/units/TablePaginationActions'
import DisplayPaper from '~src/units/DisplayPaper'
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
  popover: {
    pointerEvents: 'none',
  },
  popoverPaper: {
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.background.paper,
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
  page: number
  size: number
  total: number
  onStar: (docid: string, star: boolean) => void
  onSearch: (search: { page: number, size: number, searchTerm: string}) => void
  navigateToProfile: (id: string) => void
  onSubmitContact?: (contact: ApiContact) => void
}

export interface State {
  checked: string[]
  createFormOpened: boolean,
  createFormOption: CreateFormOption<any>,
  searchTerm: string
  popoverAnchorEl: HTMLElement | null
  popoverText: string
}

class PeopleList extends React.PureComponent<Props, State> {
  state: State = {
    checked: [],
    createFormOpened: false,
    createFormOption: {},
    searchTerm: '',
    popoverAnchorEl: null,
    popoverText: '',
  }

  private get pageNumber () {
    return Math.ceil(this.props.total / this.props.size) - 1
  }

  private handlePopoverToggle: {
    (opened: true, text: string): (event: React.MouseEvent<HTMLDivElement>) => void;
    (opened: false): (event: React.MouseEvent<HTMLDivElement>) => void;
  } = (opened: boolean, text?: string) =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      const currentTarget = event.currentTarget
      requestAnimationFrame(() => {
        this.setState({
          popoverAnchorEl: opened ? currentTarget : null,
          popoverText: opened ? text as string : '',
        })
      })
    }

  private handleSearchTermEnterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchTerm: e.target.value,
    })
    if (this.state.checked.length !== 0) {
      this.setState({
        checked: [],
      })
    }
  }

  private search = () => {
    this.props.onSearch({
      page: this.props.page,
      size: this.props.size,
      searchTerm: this.state.searchTerm,
    })
  }

  private handleSearchTermEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode !== 13) return

    this.search()
  }

  private handleChangePage = (_: any, page: number) => {
    this.props.onSearch({
      page,
      size: this.props.size,
      searchTerm: this.state.searchTerm,
    })
  }

  private handleShowProfile = (id: string) => () => {
    this.props.navigateToProfile(id)
  }

  private handleItemCheckedToggle = (id: string) => (e: React.SyntheticEvent) => {
    e.stopPropagation()
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

  private handleStarClick = (id: string, star: boolean) => (e: React.SyntheticEvent) => {
    e.stopPropagation()
    this.props.onStar(id, star)
  }

  private changeCreateFormOpened: {
    <F extends string>(opened: true, option: CreateFormOption<F>): () => void;
    (opened: false): () => void;
  } = <F extends string>(opened: boolean, option?: CreateFormOption<F>) => () => {
    this.setState({
      createFormOpened: opened,
      createFormOption: opened ? option as CreateFormOption<F> : {},
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
    const { id } = contact

    return (
      <TableRow key={id} onClick={this.handleShowProfile(id)}>
        <TableCell padding="none" className={classes.minCell}>
          <Checkbox
            onClick={this.handleItemCheckedToggle(id)}
            checked={this.state.checked.includes(id)}
            tabIndex={-1}
          />
        </TableCell>
        <TableCell padding="none" className={classes.minCell}>
          <IconButton>
            <StarBorder
              color={contact.info.starred ? 'secondary' : 'primary'}
              onClick={this.handleStarClick(id, !contact.info.starred)}
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
      value={this.state.searchTerm}
      onChange={this.handleSearchTermEnterChange}
      onKeyDown={this.handleSearchTermEnter}
      placeholder="Type a name or email"
    />
  )

  private renderLabelDisplayedRows = ({ from, to, count }: { from: number, to: number, count: number }) =>
    `${from.toLocaleString('en-IN')} - ${to.toLocaleString('en-IN')} of ${count.toLocaleString('en-IN')}`

  private renderPagination = (inTable: boolean = false) => (
    <TablePagination
      component={inTable ? undefined : 'div'}
      count={this.props.total}
      rowsPerPage={this.props.size}
      page={this.props.page}
      ActionsComponent={TablePaginationActions}
      onChangePage={this.handleChangePage}
      labelDisplayedRows={this.renderLabelDisplayedRows}
      rowsPerPageOptions={[]}
    />
  )

  private renderControls = () => (
    <>
      <IconButton
        onMouseEnter={this.handlePopoverToggle(true, 'copy')}
        onMouseLeave={this.handlePopoverToggle(false)}
      >
        <ScreenShare />
      </IconButton>
      <IconButton
        onMouseEnter={this.handlePopoverToggle(true, 'share')}
        onMouseLeave={this.handlePopoverToggle(false)}
      >
        <CallMerge />
      </IconButton>
      <IconButton
        onMouseEnter={this.handlePopoverToggle(true, 'add')}
        onMouseLeave={this.handlePopoverToggle(false)}
      >
        <PersonAdd onClick={this.changeCreateFormOpened(
          true,
          {
            title: 'New Group',
            fields: ['Group Name'],
          },
        )} />
      </IconButton>
      <IconButton
        onMouseEnter={this.handlePopoverToggle(true, 'delete')}
        onMouseLeave={this.handlePopoverToggle(false)}
      >
        <Delete />
      </IconButton>
      <Popover
        className={this.props.classes.popover}
        classes={{
          paper: this.props.classes.popoverPaper,
        }}
        open={!!this.state.popoverAnchorEl}
        anchorEl={this.state.popoverAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={this.handlePopoverToggle(false)}
        disableRestoreFocus
      >
        <Typography>{this.state.popoverText}</Typography>
      </Popover>
    </>
  )

  private submitNewContact = async (contact: object) => {
    if (this.props.onSubmitContact) {
      await this.props.onSubmitContact(contact as ApiContact)
      this.search()
      this.changeCreateFormOpened(false)()
    }
  }

  render () {
    const { classes, contacts } = this.props
    const { checked: checkedContacts, createFormOpened, createFormOption } = this.state

    const newContactFormOption: CreateFormOption<keyof ApiContact> = {
      title: 'New Contact',
      fields: ['First name', 'Last name', 'Email', 'Phone'],
      okText: 'Create',
    }

    return (
      <DisplayPaper>
        <ContactTableThemeProvider>
          <CreateForm
            option={createFormOption}
            open={createFormOpened}
            onClose={this.changeCreateFormOpened(false)}
            onOk={this.submitNewContact}
          />
          <div className={classes.head}>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.changeCreateFormOpened(true, newContactFormOption)}
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
                    {checkedContacts.length > 0 && this.renderControls()}
                  </TableCell>
                  <Hidden smDown>
                    {this.renderPagination(true)}
                  </Hidden>
                </TableRow>
              </TableHead>
              <TableBody>
                  {contacts.map(this.renderTableRows)}
              </TableBody>
            </Table>
          </div>
        </ContactTableThemeProvider>
      </DisplayPaper>
    )
  }
}

export default withStyles(styles)(PeopleList)
