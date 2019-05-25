import React, { useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'

import Icon, { ICONS } from './Icons';

const useStyles = makeStyles((theme: Theme) => ({
  searchBar: {
    padding: theme.spacing(1, 2),
    width: '100%',
  },
  searchBarSimple: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  input: {
    color: theme.palette.text.secondary,
    padding: 0,
  },
  inputAdornment: {
    fontSize: '0.87rem',
    cursor: 'pointer',
  },
  notchedOutline: {
    borderRadius: theme.spacing(3),
  },
  notchedOutlineSimple: {
    border: 'none',
  },
}))

export interface Props {
  className?: string,
  value?: string,
  onChange?: (v: string) => void
  placeholder?: string
  onKeyDown?: (v: string) => void
  theme?: 'simple'
}

const Searcher: React.FC<Props> = React.memo(({ className, value, placeholder, onChange, onKeyDown, theme }) => {
  const classes = useStyles({})

  const [text, setText] = useState(value || '')

  useEffect(
    () => { text !== value && setText(value || '') },
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
        onKeyDown && onKeyDown(text.trim())
      }
    },
    [text, onKeyDown],
  )
  const handleClickSearchIcon = useCallback(
    () => {
      onChange && onChange(text)
      onKeyDown && onKeyDown(text)
    },
    [text, onChange, onKeyDown],
  )

  const handleClick = useCallback(
    () => {
      setText('')
      onChange && onChange('')
      onKeyDown && onKeyDown('')
    },
    [onChange, onKeyDown],
  )

  return (
    <OutlinedInput
      labelWidth={0}
      notched
      classes={{
        notchedOutline: classNames(classes.notchedOutline, theme === 'simple' && classes.notchedOutlineSimple),
      }}
      className={classNames(className, classes.searchBar, theme === 'simple' && classes.searchBarSimple)}
      startAdornment={(
        <InputAdornment position="start" className={classes.inputAdornment}>
          <Icon name={ICONS.Search} onClick={handleClickSearchIcon} />
        </InputAdornment>
      )}
      endAdornment={text
        ? (
          <InputAdornment position="end" className={classes.inputAdornment} onClick={handleClick}>
            <Icon name={ICONS.Close} size="sm" />
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
