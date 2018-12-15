import React from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  input: {
    padding: 0,
  },
  inputAdornment: {
    fontSize: '0.87rem',
  },
}))

export interface Props {
  className?: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const Searcher: React.FC<Props> = React.memo(({ className, value, placeholder, onChange, onKeyDown }) => {
  const classes = useStyles({})

  return (
    <OutlinedInput
      labelWidth={0}
      notched
      className={classNames([className, classes.searchBar])}
      startAdornment={(
        <InputAdornment position="start" className={classes.inputAdornment}>
          <Search />
        </InputAdornment>
      )}
      inputProps={{
        className: classes.input,
      }}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  )
})

export default Searcher
