import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useBoolean, useInput } from 'react-hanger'
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
import Tooltip from '@material-ui/core/Tooltip'
import cssTips from '~src/utils/cssTips'
import { Contact, ContactFields } from '~src/types/Contact'

import useAlert from '~src/containers/useAlert'
import useContacts from '~src/containers/useContacts'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import ProgressLoading from '~src/units/ProgressLoading'
import CreateForm, { CreateFormOption } from '~src/components/CreateForm'
import ExportContactsForm from '~src/components/ExportContactsForm'
import MergeContactsForm from '~src/components/MergeContactsForm'
import AddContactToGroupForm from '~src/components/AddContactToGroupForm'
import RemoveContactsFromGroupForm from '~src/components/RemoveContactsFromGroupForm'
import TablePaginationActions from '~src/units/TablePaginationActions'
import DisplayPaper from '~src/units/DisplayPaper'
import Searcher from '~src/units/Searcher'
import StarThemeProvider from '~src/theme/StarThemeProvider'

import CheckCircle from '@material-ui/icons/CheckCircleOutline'
import Icon, { ICONS } from '~src/units/Icons'
import { isEmail } from '~src/utils/validation'

import debounce from 'debounce'

const useStyles = makeStyles((theme: Theme) => ({
  head: {
    ...cssTips(theme).centerFlex('space-between'),
    flexShrink: 0,
    marginBottom: theme.spacing(3),
    whiteSpace: 'nowrap',
    [theme.breakpoints.between('sm', 'md')]: {
      ...cssTips(theme, { sizeFactor: 4 }).horizontallySpaced(),
    },
    [theme.breakpoints.up('md')]: {
      ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced(),
    },
  },
  paginationHead: {
    marginBottom: theme.spacing(1),
  },
  alignRight: {
    '$head&': {
      justifyContent: 'flex-end',
    },
  },
  tableContainer: {
    ...cssTips(theme).casFlex(),
  },
  table: {
    ...cssTips(theme).casFlex(),
  },
  tableHead: {
    display: 'block',
    width: '100%',
  },
  tableBody: {
    ...cssTips(theme).growFlex(),
    display: 'block',
    width: '100%',
    overflow: 'auto',
    height: '100%',
  },
  outlinedButton: {
    borderRadius: theme.spacing(3),
  },
  search: {
    flex: 1,
  },
  download: {
    color: theme.palette.text.secondary,
    ...{
      '&:hover $downloadIcon': {
        color: theme.palette.text.primary,
      }
    }
  },
  downloadIcon: {
    marginRight: theme.spacing(1),
  },
  tableRow: {
    '&:hover': {
      backgroundColor: theme.palette.grey[900],
    },
  },
  checkedRow: {
    backgroundColor: theme.palette.grey[900],
  },
  contactName: {
    fontWeight: 600,
  },
  tableControlRow: {
    height: theme.spacing(8),
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
    marginLeft: theme.spacing(1),
    ...{
      '&&&': {
        backgroundColor: 'unset',
      },
    },
  },
  pointer: {
    cursor: 'pointer',
  },
  star: {
    color: theme.palette.grey.A200,
  },
  secondaryColor: {
    color: theme.palette.secondary.main,
  },
  svgIcon: {
    ...cssTips(theme, { svgIconFactor: 2.5 }).svgIcon(),
  },
  emptyTextWrapper: {
    ...cssTips(theme).centerFlex(),
    marginTop: '180px',
  },
  emptyTextCell: {
    display: 'block',
    width: '100%',
    borderBottom: 'none',
  },
  emptyText: {
    fontSize: `${theme.spacing(2)}px`,
    padding: theme.spacing(3, 0),
    fontWeight: 600,
  },
  progress: {
    width: `${theme.spacing(6)}px`,
    height: `${theme.spacing(6)}px`,
  },
}))


const useStyles2 = makeStyles((theme: Theme) => ({
  infoBar: {
    width: '100%',
    ...cssTips(theme).centerFlex('space-between'),
  },
  infoText: {
    ...cssTips(theme).centerFlex('normal'),
  },
  infoForePlaceholder: {
    width: theme.spacing(24),
  },
  creatingBtn: {
    textTransform: 'none',
    color: 'white',
    borderColor: 'white',
    marginRight: theme.spacing(2),
    padding: `0 ${theme.spacing(2)}px`,
    ...{
      '&:hover': {
        color: 'white',
        borderColor: 'white',
      },
      '&&&': {
        backgroundColor: 'unset',
      },
    },
  },
}))

const ContinueEditing: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const classes = useStyles2({})

  return (
    <div className={classes.infoBar}>
      <div className={classes.infoForePlaceholder} />
      <div className={classes.infoText}><CheckCircle /> Contact created!</div>
      <Button
        className={classes.creatingBtn}
        variant="outlined"
        color="primary"
        onClick={onClick}
      >
        Continue editing
      </Button>
    </div>
  )
}

export interface Props {
  page: number
  size: number
  total: number
  onSearch: (search: { page: number, size: number, searchTerm: string}) => void
  navigateToProfile: (id: string) => void
  isGroupPage?: boolean
}

const newContactFormOption: CreateFormOption = {
  title: 'New Contact',
  fields: [
    {
      type: 'combinedText', keyName: 'name', nameAndLabels: [
        { name: 'first_name', label: 'First Name', span: 1, required: true },
        { name: 'last_name', label: 'Last Name', span: 1, required: true },
      ],
    },
    { type: 'text', name: 'email', label: 'Email', required: false, validator: isEmail },
    { type: 'enumText', name: 'gender', label: 'Gender', options: ['Male', 'Female', 'Other'], required: false },
    { type: 'text', name: 'first_line', label: 'Address Line1', required: false },
    { type: 'text', name: 'second_line', label: 'Address Line2', required: false },
    { type: 'text', name: 'country', label: 'Country', required: false },
    { type: 'text', name: 'state', label: 'State', required: false },
    { type: 'text', name: 'city', label: 'City', required: false },
    {
      type: 'combinedText', keyName: 'communication', nameAndLabels: [
        { isNumber: true, name: 'zipcode', label: 'Zip', span: 1, required: false },
        { isNumber: true, name: 'phone', label: 'Phone', span: 2, required: false },
      ],
    },
  ],
  okText: 'Create',
}

const PeopleList: React.FC<Props> = React.memo(({
  total, page, size, onSearch, navigateToProfile, isGroupPage = false,
}) => {
  const classes = useStyles({})

  const { success } = useAlert()
  const {
    contacts, isFetchingContacts,
    addContactData, showAddContactMessage, addContact,
    starContact, addContactToGroup, mergeContacts, removeContactsFromGroup,
    fromContactIdState,
  } = useContacts()

  const handleShowProfile = useCallback((id: string) => () => navigateToProfile(id), [navigateToProfile])

  useEffect(
    () => {
      showAddContactMessage && addContactData && success(
        <ContinueEditing onClick={handleShowProfile(addContactData.id)} />
      )
    },
    [addContactData, handleShowProfile, showAddContactMessage, success],
  )

  const [checked, setChecked] = useState<string[]>([])
  const searchTermState = useInput('')
  const [createForm, setCreateForm] = useState<{
    opened: boolean
    option?: CreateFormOption
  }>({
    opened: false,
  })

  const {
    value: addContactToGroupFormOpened,
    setTrue: toggleOnAddContactToGroupFormOpened,
    setFalse: toggleOffAddContactToGroupFormOpened,
  } = useBoolean(false)

  const {
    value: mergeContactsOpened,
    setTrue: toggleOnMergeContactsOpened,
    setFalse: toggleOffMergeContactsOpened,
  } = useBoolean(false)

  const {
    value: removeContactFormGroupOpened,
    setTrue: toggleOnRemoveContactFormGroupOpened,
    setFalse: toggleOffRemoveContactFormGroupOpened,
  } = useBoolean(false)

  const {
    value: exportContactsOpened,
    setTrue: toggleOnExportContactsOpened,
    setFalse: toggleOffExportContactsOpened,
  } = useBoolean(false)

  // const pageNumber = useMemo(() => Math.ceil(total / size) - 1, [total, size])

  const search = useCallback(
    (term: string) => {
      searchTermState.value !== term && searchTermState.setValue(term)

      checked.length !== 0 && setChecked([])

      onSearch({ page, size, searchTerm: term })
    },
    [searchTermState, checked.length, onSearch, page, size],
  )

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      search(term)
    }, 600),
    [search],
  )

  const handleChangePage = useCallback(
    (_: any, newPage: number) => onSearch({ page: newPage + 1, size, searchTerm: searchTermState.value }),
    [onSearch, size, searchTermState],
  )

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

  interface ChangeCreateContactFormOpened {
    (opened: true, option: CreateFormOption): () => void
    (opened: false): () => void
  }

  const changeCreateContactFormOpened = useCallback<ChangeCreateContactFormOpened>(
    (opened: boolean, option?: CreateFormOption) => () => {
      setCreateForm({ opened, option: opened ? option : undefined })
    },
    [setCreateForm],
  )

  const lastContactIdsRef = useRef<string[] | null>(null)

  useEffect(
    () => {
      if (lastContactIdsRef.current !== null) {
        const lastIds = lastContactIdsRef.current
        const newerContactIds = contacts.map(contact => contact.id).filter(cid => !lastIds.includes(cid))

        lastContactIdsRef.current = null

        newerContactIds.length && fromContactIdState.setValue(newerContactIds[0])
      }
    },
    [contacts, setChecked, fromContactIdState],
  )

  const handleAddNewContact = useCallback(
    async (contact: object) => {
      if (addContact) {
        lastContactIdsRef.current = contacts.map(contact => contact.id)
        changeCreateContactFormOpened(false)()
        await addContact(contact as ContactFields)
        search(searchTermState.value)
      }
    },
    [contacts, addContact, search, changeCreateContactFormOpened, searchTermState],
  )

  const handleAddContactToGroup = useCallback(
    async (groupId: string) => {
      if (checked.length) {
        await addContactToGroup(groupId, checked)
      }
      toggleOffAddContactToGroupFormOpened()
    },
    [checked, addContactToGroup, toggleOffAddContactToGroupFormOpened],
  )

  const handleRemoveContactsFromGroup = useCallback(
    async (groupId: string) => {
      if (checked.length < 1) return

      await removeContactsFromGroup(groupId, checked)
    },
    [checked, removeContactsFromGroup],
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
    },
    [checked, mergeContacts],
  )

  const renderPCLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell className={classnames(classes.contactName, classes.w15Cell, classes.pointer)}>
        {contact.info.name}
      </TableCell>
      <TableCell className={classes.w20Cell}>{contact.info.email}</TableCell>
      <TableCell className={classes.w25Cell}>{contact.info.address}</TableCell>
      <TableCell align="left">{contact.info.phone}</TableCell>
    </>
  )

  const renderTabletLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell className={classnames(classes.contactName, classes.w25Cell, classes.pointer)}>
        {contact.info.name}
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
      <Typography component="b" variant="body1" className={classes.pointer}>{contact.info.name}</Typography>
      <Typography>{contact.info.email}</Typography>
      <Typography>{contact.info.address}</Typography>
      <Typography>{contact.info.phone}</Typography>
    </TableCell>
  )

  const renderTableRows = (contact: Contact) => {
    const { id } = contact
    const isChecked = checked.includes(id)
    const isHighLighted = fromContactIdState.value === id

    return (
      <TableRow
        key={id}
        onClick={handleShowProfile(id)}
        className={classnames(
          classes.tableRow,
          isChecked && classes.checkedRow,
          isHighLighted && classes.checkedRow,
        )}
        onMouseMove={isHighLighted ? fromContactIdState.clear : undefined}
      >
        <TableCell padding="none" className={classes.minCell}>
          <Checkbox
            checkedIcon={
              <Icon
                name={ICONS.CheckChecked}
                size="sm"
              />
            }
            icon={
              <Icon
                name={ICONS.Check}
                size="sm"
              />
            }
            onClick={handleItemCheckedToggle(id)}
            checked={isChecked}
            tabIndex={-1}
            className={classes.checkbox}
          />
        </TableCell>
        <TableCell padding="none" className={classes.minCell}>
          <IconButton onClick={handleStarClick(id, !contact.info.starred)}>
            {contact.info.starred ? (
              <Icon name={ICONS.Star} size="sm" />
            ) : (
              <Icon name={ICONS.StarStroke} size="sm" />
            )}
          </IconButton>
        </TableCell>
        <TableCell padding="none" className={classes.minCell}>
          <Avatar
            alt={contact.info.name}
            src={contact.info.avatar}
            className={classes.pointer}
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
      onChange={debouncedSearch}
      placeholder="Type a name or email"
    />
  )

  const renderLabelDisplayedRows = ({ from, to, count }: { from: number, to: number, count: number }) =>
    `${from.toLocaleString('en-IN')} - ${to.toLocaleString('en-IN')} of ${count.toLocaleString('en-IN')}`

  const renderPagination = (inTable: boolean = false) => inTable ? (
    <TablePagination
      count={total}
      rowsPerPage={size}
      page={page - 1}
      ActionsComponent={TablePaginationActions}
      onChangePage={handleChangePage}
      labelDisplayedRows={renderLabelDisplayedRows}
      rowsPerPageOptions={[]}
    />
  ) : (
    <TablePagination
      component="div"
      count={total}
      rowsPerPage={size}
      page={page - 1}
      ActionsComponent={TablePaginationActions}
      onChangePage={handleChangePage}
      labelDisplayedRows={renderLabelDisplayedRows}
      rowsPerPageOptions={[]}
    />
  )

  const renderControls = () => (
    <>
      <Tooltip title="merge">
        <IconButton onClick={toggleOnMergeContactsOpened}>
          <Icon name={ICONS.Merge} color="hoverLighten" />
        </IconButton>
      </Tooltip>
      <Tooltip title="export">
        <IconButton onClick={toggleOnExportContactsOpened}>
          <Icon name={ICONS.Export} color="hoverLighten" />
        </IconButton>
      </Tooltip>
      <Tooltip title="add to group">
        <IconButton onClick={toggleOnAddContactToGroupFormOpened}>
          <Icon name={ICONS.PersonAdd} color="hoverLighten" />
        </IconButton>
      </Tooltip>
      {isGroupPage && (
        <Tooltip title="remove from group">
          <IconButton onClick={toggleOnRemoveContactFormGroupOpened}>
            <Icon name={ICONS.Delete} color="hoverLighten" />
          </IconButton>
        </Tooltip>
      )}
    </>
  )

  return (
    <DisplayPaper>
      <ContactTableThemeProvider>
        {createForm.opened && (
          <CreateForm
            option={createForm.option}
            open={createForm.opened}
            onClose={changeCreateContactFormOpened(false)}
            onOk={handleAddNewContact}
            discardText="Your contact information won't be created unless you submit it."
          />
        )}
        {<MergeContactsForm
          open={mergeContactsOpened}
          onClose={toggleOffMergeContactsOpened}
          onOk={handleMergeContacts}
        />}
        {<ExportContactsForm
          open={exportContactsOpened}
          onClose={toggleOffExportContactsOpened}
          contactIds={checked}
        />}
        {<AddContactToGroupForm
          open={addContactToGroupFormOpened}
          onClose={toggleOffAddContactToGroupFormOpened}
          onOk={handleAddContactToGroup}
        />}
        {<RemoveContactsFromGroupForm
          open={removeContactFormGroupOpened}
          onClose={toggleOffRemoveContactFormGroupOpened}
          onOk={handleRemoveContactsFromGroup}
        />}
        <div className={classes.head}>
          <Button
            variant="outlined"
            color="primary"
            classes={{
              outlined: classes.outlinedButton,
            }}
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
            target="_blank"
          >
            <Icon
              name={ICONS.DownloadPlugin}
              className={classes.downloadIcon}
              color="hoverLighten"
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
          <div className={classnames(classes.head, classes.paginationHead, classes.alignRight)}>
            {renderPagination()}
          </div>
        </Hidden>
        <div className={classes.tableContainer}>
          <Table className={classes.table}>
            <TableHead className={classes.tableHead}>
              <TableRow className={classes.tableControlRow}>
                <TableCell padding="none" className={classes.minCell}>
                  <Checkbox
                    checkedIcon={
                      <Icon
                        name={ICONS.CheckChecked}
                        size="sm"
                      />
                    }
                    icon={
                      <Icon
                        name={ICONS.Check}
                        size="sm"
                      />
                    }
                    checked={allChecked}
                    onClick={handleToggleAllChecked}
                    className={classes.checkbox}
                  />
                </TableCell>

                <Hidden lgDown>
                  <TableCell colSpan={4} padding="none">
                    {checked.length > 0 && renderControls()}
                  </TableCell>
                </Hidden>
                <Hidden xlUp smDown>
                  <TableCell colSpan={3} padding="none">
                    {checked.length > 0 && renderControls()}
                  </TableCell>
                </Hidden>
                <Hidden mdUp>
                  <TableCell colSpan={4} padding="none">
                    {checked.length > 0 && renderControls()}
                  </TableCell>
                </Hidden>
                <Hidden smDown>
                  {renderPagination(true)}
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {isFetchingContacts
                ? (
                  <TableRow className={classes.emptyTextWrapper}>
                    <TableCell padding="none">
                      <ProgressLoading className={classes.progress} />
                    </TableCell>
                  </TableRow>
                )
                : (
                  contacts.length === 0 && (
                    <TableRow className={classes.emptyTextWrapper}>
                      <TableCell padding="none" className={classes.emptyTextCell}>
                        <Typography align={"center"} color="secondary" variant="body1" className={classes.emptyText}>
                          {searchTermState.hasValue ? 'There are no contacts' : 'There are no results that match your search'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                )
              }
              <StarThemeProvider>
                {!isFetchingContacts && contacts.map(renderTableRows)}
              </StarThemeProvider>
            </TableBody>
          </Table>
        </div>
      </ContactTableThemeProvider>
    </DisplayPaper>
  )
})

export default PeopleList
