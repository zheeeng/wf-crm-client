import React, { useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'
import Close from '@material-ui/icons/Close'

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  input: {
    color: theme.palette.text.secondary,
    padding: 0,
  },
  inputAdornment: {
    fontSize: '0.87rem',
  },
}))

export interface Props {
  className?: string,
  value?: string,
  onChange?: (v: string) => void
  placeholder?: string
  onKeyDown?: (v: string) => void
}

const Searcher: React.FC<Props> = React.memo(({ className, value, placeholder, onChange, onKeyDown }) => {
  const classes = useStyles({})

  const [text, setText] = useState(value)

  useEffect(
    () => {
      if (text !== value) {
        setText(value)
      }
    },
    [value],
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const t = event.target.value
      setText(t)
      onChange && onChange(t)
    },
    [onChange],
  )
  const handleEnter = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === 13) {
        const term = event.currentTarget.value.trim()
        onKeyDown && onKeyDown(term)
      }
    },
    [onKeyDown],
  )

  const handleClick = useCallback(
    () => {
      setText('')
      onChange && onChange('')
      onKeyDown && onKeyDown('')
    },
    [],
  )

  return (
    <OutlinedInput
      labelWidth={0}
      notched
      className={classNames(className, classes.searchBar)}
      startAdornment={(
        <InputAdornment position="start" className={classes.inputAdornment}>
          <Search />
        </InputAdornment>
      )}
      endAdornment={text
        ? (
          <InputAdornment position="end" className={classes.inputAdornment} onClick={handleClick}>
            <Close />
          </InputAdornment>
        )
        : undefined
      }
      inputProps={{
        className: classes.input,
      }}
      value={text}
      onChange={handleChange}
      onKeyDown={handleEnter}
      placeholder={placeholder}
    />
  )
})

export default Searcher
