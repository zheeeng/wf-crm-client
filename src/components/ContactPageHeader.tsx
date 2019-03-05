import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import cssTips from '~src/utils/cssTips'

import arrowLeftSVG from '~src/assets/icons/arrow-left.svg'
import arrowUpSVG from '~src/assets/icons/arrow-up.svg'
import arrowDownSVG from '~src/assets/icons/arrow-down.svg'
import deleteSVG from '~src/assets/icons/delete.svg'

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
  disableGoPrevious: boolean
  disableGoNext: boolean
}

const ContactPageHeader: React.FC<Props> = React.memo(
  ({ onGoBack, onGoPrevious, onGoNext,  onDelete, disableGoPrevious, disableGoNext }) => {
    const classes = useStyles({})

    return (
      <>
        <div className={classes.left}>
          <img src={arrowLeftSVG} onClick={onGoBack} />
          <img src={arrowDownSVG}
            onClick={onGoNext}
            // TODO::
            color={disableGoNext ? 'disabled' : undefined}
          />
          <img src={arrowDownSVG}
            onClick={onGoPrevious}
            // TODO::
            color={disableGoPrevious ? 'disabled' : undefined}
          />
        </div>
        <img src={deleteSVG} className={classes.delete} onClick={onDelete} />
      </>
    )
  },
)

export default ContactPageHeader
