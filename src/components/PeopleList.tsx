import React, { useState, useMemo, useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
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
import { Contact, ContactAPI } from '~src/types/Contact'

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
}))

export interface Props {
  contacts: Contact[]
  page: number
  size: number
  total: number
  onStar: (docid: string, star: boolean) => void
  onSearch: (search: { page: number, size: number, searchTerm: string}) => void
  navigateToProfile: (id: string) => void
  onSubmitContact?: (contact: ContactAPI) => void
}

const PeopleList: React.FC<Props> = React.memo(({
  contacts, total, page, size, onSearch, navigateToProfile, onStar, onSubmitContact,
}) => {
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

  const handleSearchTermEnterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
      checked.length !== 0 && setChecked([])
    },
    [searchTerm, checked],
  )

  const search = useCallback(() => onSearch({ page, size, searchTerm }), [page, size, searchTerm])

  const handleSearchTermEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => e.keyCode === 13 && search(),
    [search],
  )

  const handleChangePage = useCallback(
    (_: any, newPage: number) => onSearch({ page: newPage, size, searchTerm }),
    [onSearch, size, searchTerm],
  )

  const handleShowProfile = useCallback((id: string) => () => navigateToProfile(id), [navigateToProfile])

  const handleItemCheckedToggle = useCallback(
    (id: string) => (e: React.SyntheticEvent) => {
      e.stopPropagation()
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

  const handleStarClick = useCallback(
    (id: string, star: boolean) => (e: React.SyntheticEvent) => {
      e.stopPropagation()
      onStar(id, star)
    },
    [onStar],
  )

  const changeCreateFormOpened = useCallback<{
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

  const submitNewContact = useCallback(
    async (contact: object) => {
      if (onSubmitContact) {
        onSubmitContact(contact as ContactAPI)
        search()
        changeCreateFormOpened(false)()
      }
    },
    [onSubmitContact, search, changeCreateFormOpened],
  )

  const renderPCLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell className={classes.w15Cell}>
        <Typography component="strong" variant="subtitle1">{contact.info.name}</Typography>
      </TableCell>
      <TableCell className={classes.w20Cell}>{contact.info.email}</TableCell>
      <TableCell className={classes.w25Cell}>{contact.info.address}</TableCell>
      <TableCell numeric>{contact.info.telephone}</TableCell>
    </>
  )

  const renderTabletLayoutTableRows = (contact: Contact) => (
    <>
      <TableCell className={classes.w25Cell}>
        <Typography component="strong" variant="subtitle1">{contact.info.name}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{contact.info.email}</Typography>
        <Typography>{contact.info.address}</Typography>
        <Typography>{contact.info.telephone}</Typography>
      </TableCell>
    </>
  )

  const renderMobileLayoutTableRows = (contact: Contact) => (
    <TableCell>
      <Typography component="strong" variant="subtitle1">{contact.info.name}</Typography>
      <Typography>{contact.info.email}</Typography>
      <Typography>{contact.info.address}</Typography>
      <Typography>{contact.info.telephone}</Typography>
    </TableCell>
  )

  const renderTableRows = (contact: Contact) => {
    const { id } = contact

    return (
      <TableRow key={id} onClick={handleShowProfile(id)}>
        <TableCell padding="none" className={classes.minCell}>
          <Checkbox
            onClick={handleItemCheckedToggle(id)}
            checked={checked.includes(id)}
            tabIndex={-1}
          />
        </TableCell>
        <TableCell padding="none" className={classes.minCell}>
          <IconButton>
            <StarBorder
              color={contact.info.starred ? 'secondary' : 'primary'}
              onClick={handleStarClick(id, !contact.info.starred)}
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
      value={searchTerm}
      onChange={handleSearchTermEnterChange}
      onKeyDown={handleSearchTermEnter}
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
        onMouseEnter={handlePopoverToggle(true, 'copy')}
        onMouseLeave={handlePopoverToggle(false)}
      >
        <ScreenShare />
      </IconButton>
      <IconButton
        onMouseEnter={handlePopoverToggle(true, 'share')}
        onMouseLeave={handlePopoverToggle(false)}
      >
        <CallMerge />
      </IconButton>
      <IconButton
        onMouseEnter={handlePopoverToggle(true, 'add')}
        onMouseLeave={handlePopoverToggle(false)}
      >
        <PersonAdd onClick={changeCreateFormOpened(
          true,
          {
            title: 'New Group',
            fields: ['Group Name'],
          },
        )} />
      </IconButton>
      <IconButton
        onMouseEnter={handlePopoverToggle(true, 'delete')}
        onMouseLeave={handlePopoverToggle(false)}
      >
        <Delete />
      </IconButton>
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

  const newContactFormOption: CreateFormOption<keyof ContactAPI> = {
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
          onClose={changeCreateFormOpened(false)}
          onOk={submitNewContact}
        />
        <div className={classes.head}>
          <Button
            variant="outlined"
            color="primary"
            onClick={changeCreateFormOpened(true, newContactFormOption)}
          >New contact</Button>
          <Hidden smDown>
            {renderSearcher()}
          </Hidden>
          <Button color="primary">
            <MaterialIcon icon="CloudDownload" className={classes.leftIcon} />
            Download Plugin
          </Button>
        </div>
        <Hidden mdUp>
          <div className={classes.head}>
          {renderSearcher()}
          </div>
        </Hidden>
        <Hidden mdUp>
          <div className={classNames([classes.head, classes.alignRight])}>
            {renderPagination()}
          </div>
        </Hidden>
        <div className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="none" className={classes.minCell}>
                  <Checkbox
                    checked={contacts.every(contact => checked.includes(contact.id))}
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
                {contacts.map(renderTableRows)}
            </TableBody>
          </Table>
        </div>
      </ContactTableThemeProvider>
    </DisplayPaper>
  )
})

export default PeopleList
