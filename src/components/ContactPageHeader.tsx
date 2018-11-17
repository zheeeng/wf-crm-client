import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import Delete from '@material-ui/icons/Delete'
import cssTips from '~src/utils/cssTips'

const styles = (theme: Theme) => createStyles({
  left: {
    ...cssTips(theme).horizontallySpaced,
  },
})

export interface Props extends WithStyles<typeof styles> {
}

export interface State {
}

const ContactPageHeader: React.FC<Props> = React.memo(props =>
  (
    <>
      <div className={props.classes.left}>
        <NavigateBefore />
        <KeyboardArrowDown />
        <KeyboardArrowUp />
      </div>
      <Delete />
    </>
  ))

export default withStyles(styles)(ContactPageHeader)
