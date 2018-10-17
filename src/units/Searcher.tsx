import * as React from 'react'
import classNames from 'classnames'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'

const styles = (theme: Theme) => createStyles({
  searchBar: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  outlined: {
    borderRadius: theme.spacing.unit * 2,
  },
  input: {
    padding: 0,
  },
})

export interface Props extends WithStyles<typeof styles> {
  className: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

class Searcher extends React.PureComponent<Props> {
  render () {
    const { className, value, placeholder, onChange, classes } = this.props

    return (
      <OutlinedInput
        labelWidth={0}
        notched
        className={classNames([className, classes.searchBar])}
        startAdornment={(
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        )}
        inputProps={{
          className: classes.input,
        }}
        classes={{
          notchedOutline: classes.outlined,
        }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    )
  }
}

export default withStyles(styles)(Searcher)
