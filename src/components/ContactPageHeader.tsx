import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import cssTips from '~src/utils/cssTips'

import Icon, { ICONS } from '~src/units/Icons'

const useStyles = makeStyles((theme: Theme) => ({
  left: {
    ...cssTips(theme).horizontallySpaced(),
  },
  delete: {
    cursor: 'pointer',
  },
  navIcon: {
    cursor: 'pointer',
  }
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
          <Icon
            name={ICONS.ArrowLeft}
            onClick={onGoBack}
            color="hoverLighten"
            className={classes.navIcon}
            size="lg"
          />
          <Icon
            name={ICONS.ArrowDown}
            onClick={onGoNext}
            color={disableGoNext ? 'disabled' : "hoverLighten"}
            className={classes.navIcon}
            size="lg"
          />
          <Icon name={ICONS.ArrowUp}
            onClick={onGoPrevious}
            color={disableGoPrevious ? 'disabled' : "hoverLighten"}
            className={classes.navIcon}
            size="lg"
          />
        </div>
        <Icon
          name={ICONS.Delete}
          className={classes.delete}
          onClick={onDelete}
          color="hoverLighten"
          size="lg"
        />
      </>
    )
  },
)

export default ContactPageHeader
