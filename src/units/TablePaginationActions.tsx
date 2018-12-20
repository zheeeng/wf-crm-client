import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions'
import Hidden from '@material-ui/core/Hidden'
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

  const handleFirstPageButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => onChangePage(event, 0),
    [onChangePage],
  )

  const handleBackButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => onChangePage(event, page - 1),
    [onChangePage, page],
  )

  const handleNextButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => onChangePage(event, page + 1),
    [onChangePage, page],
  )

  const handleLastPageButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) =>
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1)),
    [onChangePage, page, count, rowsPerPage],
  )

  const handleEnterNewPage = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const newPage = event.currentTarget.value.trim()
      event.currentTarget.value = ''
      !isNaN(+newPage) && onChangePage(null, parseInt(newPage, 10))
    },
    [page, count, rowsPerPage],
  )

  return (
    <div className={classes.root}>
      <Hidden smDown>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          <FirstPageIcon />
        </IconButton>
      </Hidden>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="Previous Page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <Hidden smDown>
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
      </Hidden>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Next Page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <Hidden smDown>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <LastPageIcon />
        </IconButton>
      </Hidden>
    </div>
  )
})

export default TablePaginationActions
