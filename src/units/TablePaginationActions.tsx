import React, { useCallback } from 'react'
import { useBoolean } from 'react-hanger'
import useUpdateEffect from 'react-use/lib/useUpdateEffect'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'

import BasicFormInput from '~src/units/BasicFormInput'
import RestoreThemeProvider from '~src/theme/RestoreThemeProvider'

import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
  textField: {
    display: 'inline-block',
    margin: '8px 4px',
    width: theme.spacing(7),
    height: theme.spacing(4),
    fontSize: 0,
    padding: 0,
  },
  textFieldInput: {
    textAlign: 'center',
  },
  textFieldInputRoot: {
    padding: '0 8px',
    fontSize: '12px',
    '&&': {
      marginTop: theme.spacing(0.5),
    },
  },
}))

const TablePaginationActions: React.FC<TablePaginationActionsProps> =
  React.memo(({ onChangePage, page, count, rowsPerPage }) => {
    const classes = useStyles({})

    const handleFirstPageButtonClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => onChangePage(event, 0),
      [onChangePage],
    )

    const handleBackButtonClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) =>
        onChangePage(event, page - 1),
      [onChangePage, page],
    )

    const handleNextButtonClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) =>
        onChangePage(event, page + 1),
      [onChangePage, page],
    )

    const handleLastPageButtonClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) =>
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1)),
      [onChangePage, count, rowsPerPage],
    )

    const handleEnterNewPage = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        const newPage = event.currentTarget.value.trim()
        !isNaN(+newPage) && onChangePage(null, parseInt(newPage, 10) - 1)
      },
      [onChangePage],
    )

    const afterUpdate = useBoolean(false)

    useUpdateEffect(() => {
      !afterUpdate.value && afterUpdate.setTrue()
    })

    return (
      <RestoreThemeProvider>
        <div className={classes.root}>
          <Hidden smDown>
            <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={page <= 0}
              aria-label="First Page"
            >
              <FirstPageIcon />
            </IconButton>
          </Hidden>
          <IconButton
            onClick={handleBackButtonClick}
            disabled={page <= 0}
            aria-label="Previous Page"
          >
            <KeyboardArrowLeft />
          </IconButton>
          <Hidden smDown>
            <BasicFormInput
              autoFocus={afterUpdate.value}
              placeholder="Jump"
              noLabel
              value={(page + 1).toString()}
              onEnterPress={handleEnterNewPage}
              TextFieldClasses={{
                root: classes.textField,
              }}
              InputClasses={{
                root: classes.textFieldInputRoot,
                input: classes.textFieldInput,
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
      </RestoreThemeProvider>
    )
  })

export default TablePaginationActions
