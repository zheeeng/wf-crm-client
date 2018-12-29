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
  onGoBack: React.MouseEventHandler
  onGoPrevious: React.MouseEventHandler
  onGoNext: React.MouseEventHandler
  onDelete: React.MouseEventHandler
  previousDisabled: boolean,
  nextDisabled: boolean,
}

const ContactPageHeader: React.FC<Props> = React.memo(
  ({ onGoBack, onGoPrevious, onGoNext,  onDelete, previousDisabled, nextDisabled }) => {
    const classes = useStyles({})

    return (
      <>
        <div className={classes.left}>
          <NavigateBefore onClick={onGoBack} />
          <KeyboardArrowDown
            color={previousDisabled ? 'disabled' : 'primary'}
            onClick={previousDisabled ? undefined : onGoPrevious}
          />
          <KeyboardArrowUp
            color={nextDisabled ? 'disabled' : 'primary'}
            onClick={nextDisabled ? undefined : onGoNext}
          />
        </div>
        <Delete className={classes.delete} onClick={onDelete} />
      </>
    )
  },
)

export default ContactPageHeader
