import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import Delete from '@material-ui/icons/Delete'
import cssTips from '~src/utils/cssTips'

const useStyles = makeStyles((theme: Theme) => ({
  left: {
    ...cssTips(theme).horizontallySpaced,
  },
  delete: {
    cursor: 'pointer',
  },
}))

export interface Props {
  onDelete: React.MouseEventHandler
}

const ContactPageHeader: React.FC<Props> = React.memo(({ onDelete }) => {
  const classes = useStyles({})

  return (
    <>
      <div className={classes.left}>
        <NavigateBefore />
        <KeyboardArrowDown />
        <KeyboardArrowUp />
      </div>
      <Delete className={classes.delete} onClick={onDelete} />
    </>
  )
})

export default ContactPageHeader
