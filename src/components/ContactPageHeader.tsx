import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import cssTips from '~src/utils/cssTips'

import NavigateBefore from '@material-ui/icons/NavigateBefore'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import Icon, { ICONS } from '~src/units/Icons'

const useStyles = makeStyles((theme: Theme) => ({
  left: {
    ...cssTips(theme).horizontallySpaced(),
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
  disableGoPrevious: boolean
  disableGoNext: boolean
}

const ContactPageHeader: React.FC<Props> = React.memo(
  ({ onGoBack, onGoPrevious, onGoNext,  onDelete, disableGoPrevious, disableGoNext }) => {
    const classes = useStyles({})

    return (
      <>
        <div className={classes.left}>
          <NavigateBefore onClick={onGoBack} />
          <KeyboardArrowDown
            onClick={onGoNext}
            color={disableGoNext ? 'disabled' : undefined}
          />
          <KeyboardArrowUp
            onClick={onGoPrevious}
            color={disableGoPrevious ? 'disabled' : undefined}
          />
        </div>
        <Icon name={ICONS.Delete} className={classes.delete} onClick={onDelete} />
      </>
    )
  },
)

export default ContactPageHeader
