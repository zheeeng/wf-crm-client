import * as React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

import BasicFormInput from '~src/units/BasicFormInput'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      flexShrink: 0,
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing.unit * 2.5,
    },
    textField: {
      display: 'inline-block',
      margin: '12px 4px',
      width: theme.spacing.unit * 4,
      height: 'initial',
      fontSize: 0,
      padding: 0,
    },
    textFieldInput: {
      padding: '0 8px',
      fontSize: '12px',
    },
  }),
)

const TablePaginationActions: React.FC<TablePaginationActionsProps> = React.memo(({
  onChangePage, page, count, rowsPerPage,
}) => {
  const classes = useStyles({})

  const handleFirstPageButtonClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, 0)
    },
    [onChangePage],
  )

  const handleBackButtonClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, page - 1)
    },
    [onChangePage, page],
  )

  const handleNextButtonClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, page + 1)
    },
    [onChangePage, page],
  )

  const handleLastPageButtonClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    },
    [onChangePage, page, count, rowsPerPage],
  )

  const handleEnterNewPage = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const newPage = event.currentTarget.value.trim()
      event.currentTarget.value = ''
      if (isNaN(+newPage)) return

      onChangePage(null, parseInt(newPage, 10))
    },
    [page, count, rowsPerPage],
  )

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="First Page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="Previous Page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <BasicFormInput
        placeholder="Jump"
        onEnterPress={handleEnterNewPage}
        TextFieldClasses={{
          root: classes.textField,
        }}
        InputClasses={{
          root: classes.textFieldInput,
        }}
      />
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Next Page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Last Page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  )
})

export default TablePaginationActions
