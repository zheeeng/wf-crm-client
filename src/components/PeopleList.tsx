import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
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
import { Contact, ContactFields } from '~src/types/Contact'

import StarBorder from '@material-ui/icons/StarBorder'
import Star from '@material-ui/icons/Star'
import CallMerge from '@material-ui/icons/CallMerge'
import ScreenShare from '@material-ui/icons/ScreenShare'
import PersonAdd from '@material-ui/icons/PersonAdd'
// import Delete from '@material-ui/icons/Delete'
import CheckCircle from '@material-ui/icons/CheckCircle'

import useToggle from '~src/hooks/useToggle'
import AlertContainer from '~src/containers/Alert'
import ContactsContainer from '~src/containers/Contacts'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import CreateForm, { CreateFormOption } from '~src/components/CreateForm'
import ExportContactsForm from '~src/components/ExportContactsForm'
import MergeContactsForm from '~src/components/MergeContactsForm'
import AddContactToGroupForm from '~src/components/AddContactToGroupForm'
import TablePaginationActions from '~src/units/TablePaginationActions'
import DisplayPaper from '~src/units/DisplayPaper'
import Searcher from '~src/units/Searcher'
import MaterialIcon from '~src/units/MaterialIcon'
import StarThemeProvider from '~src/theme/StarThemeProvider'

const useStyles = makeStyles((theme: Theme) => ({
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
    flex: 1,
    overflowY: 'auto',
  },
  search: {
    flex: 1,
  },
  download: {
    color: theme.palette.text.secondary,
  },
  downloadIcon: {
    marginRight: theme.spacing.unit,
  },
  tableRow: {
  },
  checkedRow: {
    backgroundColor: theme.palette.grey[900],
  },
  contactName: {
    fontWeight: 600,
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
  checkbox: {
    color: theme.palette.grey.A200,
  },
  star: {
    color: theme.palette.grey.A200,
  },
}))

export interface Props {
  page: number
  size: number
  total: number
  onSearch: (search: { page: number, size: number, searchTerm: string}) => void
  navigateToProfile: (id: string) => void
}

const PeopleList: React.FC<Props> = React.memo(({
  total, page, size, onSearch, navigateToProfile,
}) => {
  const { success, fail } = useContext(AlertContainer.Context)
  const {
    contacts,
    addContactData, addContact, addContactError,
    starContact, starContactError,
    // removeContacts, removeContactError,
    addContactToGroupData, addContactToGroup, addContactToGroupError,
    mergeContactsData, mergeContacts, mergeContactsError,
  } = useContext(ContactsContainer.Context)

  useEffect(
    () => {
      addContactError && fail(addContactError.message)
      addContactData && success(<><CheckCircle /> Contact Created</>)
    },
    [addContactError, addContactData],
  )
  useEffect(
    () => {
      starContactError && fail('Star contacts failed')
    },
    [starContactError],
  )
  // useEffect(
  //   () => {
  //     removeContactError && fail('Remove contact failed')
  //     removeContactData && success(<><CheckCircle /> Contacts Removed</>)
  //   },
  //   [removeContactError, removeContactData],
  // )
  useEffect(
    () => {
      addContactToGroupError && fail('Add contacts failed')
      addContactToGroupData && success(<><CheckCircle /> Contacts Added</>)
    },
    [addContactToGroupError, addContactToGroupData],
  )
  useEffect(
    () => {
      mergeContactsError && fail('Merge contacts failed')
      mergeContactsData && success(<><CheckCircle /> Contacts Merged</>)
    },
    [mergeContactsError, mergeContactsData],
  )

  const classes = useStyles({})
  const [popover, setPopover] = useState({
    anchorEl: null as HTMLElement | null,
    text: '',
  })
  const [checked, setChecked] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [createForm, setCreateForm] = useState({
    opened: false,
    // tslint:disable-next-line:no-object-literal-type-assertion
    option: {} as CreateFormOption<any>,
  })
  const {
    value: addContactToGroupFormOpened,
    toggleOn: toggleOnAddContactToGroupFormOpened,
    toggleOff: toggleOffAddContactToGroupFormOpened,
  } = useToggle(false)

  const {
    value: mergeContactsOpened,
    toggleOn: toggleOnMergeContactsOpened,
    toggleOff: toggleOffMergeContactsOpened,
  } = useToggle(false)

  const {
    value: exportContactsOpened,
    toggleOn: toggleOnExportContactsOpened,
    toggleOff: toggleOffExportContactsOpened,
  } = useToggle(false)

  const pageNumber = useMemo(() => Math.ceil(total / size) - 1, [total, size])

  const handlePopoverToggle = useCallback<{
    (opened: true, text: string): (event: React.MouseEvent<HTMLDivElement>) => void;
    (opened: false): (event: React.MouseEvent<HTMLDivElement>) => void;
  }> (
    (opened: boolean, text?: string) =>
      (event: React.MouseEvent<HTMLDivElement>) => {
        const currentTarget = event.currentTarget
        requestAnimationFrame(() => {
          setPopover({
            anchorEl: opened ? currentTarget : null,
            text: opened ? text as string : '',
          })
        })
      },
    [popover],
  )

  const search = useCallback(
    (term: string) => {
      searchTerm !== term && setSearchTerm(term)

      checked.length !== 0 && setChecked([])

      onSearch({ page, size, searchTerm: term })
    },
    [page, size, searchTerm],
  )

  const handleChangePage = useCallback(
    (_: any, newPage: number) => onSearch({ page: newPage, size, searchTerm }),
    [onSearch, size, searchTerm],
  )

  const handleShowProfile = useCallback((id: string) => () => navigateToProfile(id), [navigateToProfile])

  const handleItemCheckedToggle = useCallback(
    (id: string) => (e: React.SyntheticEvent) => {
      e.stopPropagation()
      e.preventDefault()
      const currentIndex = checked.indexOf(id)
      const newChecked = [...checked]

      currentIndex === -1 ? newChecked.push(id) : newChecked.splice(currentIndex, 1)

      setChecked(newChecked)
    },
    [checked],
  )

  const handleToggleAllChecked = useCallback(
    () => checked.length ? setChecked([]) : setChecked(contacts.map(contact => contact.id)),
    [checked, contacts],
  )

  const allChecked = useMemo(
    () => contacts.length !== 0
      && contacts.length === checked.length
      && contacts.every(contact => checked.includes(contact.id)),
    [contacts, checked],
  )

  const handleStarClick = useCallback(
    (id: string, star: boolean) => (e: React.SyntheticEvent) => {
      e.stopPropagation()
      starContact(id, star)
    },
    [starContact],
  )

  const changeCreateContactFormOpened = useCallback<{
    <F extends string>(opened: true, option: CreateFormOption<F>): () => void;
    (opened: false): () => void;
  }>(
    <F extends string>(opened: boolean, option?: CreateFormOption<F>) => () => {
      setCreateForm({
        opened,
        option: opened ? option as CreateFormOption<F> : {},
      })
    },
    [createForm],
  )

  const handleAddNewContact = useCallback(
    async (contact: object) => {
      if (addContact) {
        addContact(contact as ContactFields)
        search(searchTerm)
        changeCreateContactFormOpened(false)()
      }
    },
    [addContact, search, changeCreateContactFormOpened, searchTerm],
  )

  const handleAddContactToGroup = useCallback(
    async (groupId: string) => {
      if (checked.length) {
        await addContactToGroup(groupId, checked)
      }
      toggleOffAddContactToGroupFormOpened()
    },
    [checked],
  )

  // const handleContactsRemove = useCallback(
  //   async () => {
  //     if (checked.length) {
  //       await removeContacts(checked)
  //     }
  //     setChecked([])
  //   },
  //   [checked],
  // )

  const handleMergeContacts = useCallback(
    async () => {
      if (checked.length < 2) return

      await mergeContacts(checked)
      onSearch({ page, size, searchTerm })
    },
    [checked, page, size, searchTerm],
  )

  const renderPCLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell className={classnames(classes.contactName, classes.w15Cell)}>
        {contact.info.name}
      </TableCell>
      <TableCell className={classes.w20Cell}>{contact.info.email}</TableCell>
      <TableCell className={classes.w25Cell}>{contact.info.address}</TableCell>
      <TableCell align="left">{contact.info.phone}</TableCell>
    </>
  )

  const renderTabletLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell className={classes.w25Cell}>
        <Typography component="b" variant="body1">{contact.info.name}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{contact.info.email}</Typography>
        <Typography>{contact.info.address}</Typography>
        <Typography>{contact.info.phone}</Typography>
      </TableCell>
    </>
  )

  const renderMobileLayoutTableRows = (contact: Contact) => (
    <TableCell>
      <Typography component="b" variant="body1">{contact.info.name}</Typography>
      <Typography>{contact.info.email}</Typography>
      <Typography>{contact.info.address}</Typography>
      <Typography>{contact.info.phone}</Typography>
    </TableCell>
  )

  const renderTableRows = (contact: Contact) => {
    const { id } = contact
    const isChecked = checked.includes(id)

    return (
      <TableRow
        key={id}
        onClick={handleShowProfile(id)}
        className={classnames(classes.tableRow, isChecked && classes.checkedRow)}
      >
        <TableCell padding="none" className={classes.minCell}>
          <Checkbox
            onClick={handleItemCheckedToggle(id)}
            checked={isChecked}
            tabIndex={-1}
            className={classes.checkbox}
          />
        </TableCell>
        <TableCell padding="none" className={classes.minCell}>
          <IconButton onClick={handleStarClick(id, !contact.info.starred)}>
            {contact.info.starred ? (
              <Star color="secondary" />
            ) : (
            <StarBorder className={classes.star} />
            )}
          </IconButton>
        </TableCell>
        <TableCell padding="none" className={classes.minCell}>
          <Avatar
            alt="Remy Sharp"
            src={contact.info.avatar}
          />
        </TableCell>
        <Hidden mdDown>
          {renderPCLayoutTableRows(contact)}
        </Hidden>
        <Hidden lgUp xsDown>
          {renderTabletLayoutTableRows(contact)}
        </Hidden>
        <Hidden smUp>
          {renderMobileLayoutTableRows(contact)}
        </Hidden>
      </TableRow>
    )
  }

  const renderSearcher = () => (
    <Searcher
      className={classes.search}
      onKeyDown={search}
      placeholder="Type a name or email"
    />
  )

  const renderLabelDisplayedRows = ({ from, to, count }: { from: number, to: number, count: number }) =>
    `${from.toLocaleString('en-IN')} - ${to.toLocaleString('en-IN')} of ${count.toLocaleString('en-IN')}`

  const renderPagination = (inTable: boolean = false) => (
    <TablePagination
      component={inTable ? undefined : 'div'}
      count={total}
      rowsPerPage={size}
      page={page}
      ActionsComponent={TablePaginationActions}
      onChangePage={handleChangePage}
      labelDisplayedRows={renderLabelDisplayedRows}
      rowsPerPageOptions={[]}
    />
  )

  const renderControls = () => (
    <>
      <IconButton
        onMouseEnter={handlePopoverToggle(true, 'merge')}
        onMouseLeave={handlePopoverToggle(false)}
        onClick={toggleOnMergeContactsOpened}
      >
        <ScreenShare />
      </IconButton>
      <IconButton
        onMouseEnter={handlePopoverToggle(true, 'export')}
        onMouseLeave={handlePopoverToggle(false)}
        onClick={toggleOnExportContactsOpened}
      >
        <CallMerge />
      </IconButton>
      <IconButton
        onMouseEnter={handlePopoverToggle(true, 'add to group')}
        onMouseLeave={handlePopoverToggle(false)}
        onClick={toggleOnAddContactToGroupFormOpened}
      >
        <PersonAdd />
      </IconButton>
      {/* <IconButton
        onMouseEnter={handlePopoverToggle(true, 'delete')}
        onMouseLeave={handlePopoverToggle(false)}
        onClick={handleContactsRemove}
      >
        <Delete />
      </IconButton> */}
      <Popover
        className={classes.popover}
        classes={{
          paper: classes.popoverPaper,
        }}
        open={!!popover.anchorEl}
        anchorEl={popover.anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverToggle(false)}
        disableRestoreFocus
      >
        <Typography>{popover.text}</Typography>
      </Popover>
    </>
  )

  const newContactFormOption: CreateFormOption<keyof ContactFields> = {
    title: 'New Contact',
    fields: ['First name', 'Last name', 'Email', 'Phone'],
    okText: 'Create',
  }

  return (
    <DisplayPaper>
      <ContactTableThemeProvider>
        <CreateForm
          option={createForm.option}
          open={createForm.opened}
          onClose={changeCreateContactFormOpened(false)}
          onOk={handleAddNewContact}
        />
        <MergeContactsForm
          open={mergeContactsOpened}
          onClose={toggleOffMergeContactsOpened}
          onOk={handleMergeContacts}
        />
        <ExportContactsForm
          open={exportContactsOpened}
          onClose={toggleOffExportContactsOpened}
          contactIds={checked}
        />
        <AddContactToGroupForm
          open={addContactToGroupFormOpened}
          onClose={toggleOffAddContactToGroupFormOpened}
          onOk={handleAddContactToGroup}
        />
        <div className={classes.head}>
          <Button
            variant="outlined"
            color="primary"
            onClick={changeCreateContactFormOpened(true, newContactFormOption)}
          >
            New contact
          </Button>
          <Hidden smDown>
            {renderSearcher()}
          </Hidden>
          <Button
            color="primary"
            href="https://chrome.google.com/webstore/detail/waiverforever-connect/hojbfdlckjamkeacedcejbahgkgagedk"
            className={classes.download}
          >
            <MaterialIcon
              icon="CloudDownload"
              className={classes.downloadIcon}
            />
            Download Plugin
          </Button>
        </div>
        <Hidden mdUp>
          <div className={classes.head}>
          {renderSearcher()}
          </div>
        </Hidden>
        <Hidden mdUp>
          <div className={classnames(classes.head, classes.alignRight)}>
            {renderPagination()}
          </div>
        </Hidden>
        <div className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none" className={classes.minCell}>
                  <Checkbox
                    checked={allChecked}
                    onClick={handleToggleAllChecked}
                  />
                </TableCell>
                <TableCell colSpan={3} padding="none">
                  {checked.length > 0 && searchTerm === '' && renderControls()}
                </TableCell>
                <Hidden smDown>
                  {renderPagination(true)}
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              <StarThemeProvider>
                {contacts.map(renderTableRows)}
              </StarThemeProvider>
            </TableBody>
          </Table>
        </div>
      </ContactTableThemeProvider>
    </DisplayPaper>
  )
})

export default PeopleList
