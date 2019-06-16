import React from 'react'
import ToolTip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'

import Icon, { ICONS } from '~src/units/Icons'

export interface Props {
  onGoBack: React.MouseEventHandler
  onGoPrevious: React.MouseEventHandler
  onGoNext: React.MouseEventHandler
  onDelete: React.MouseEventHandler
  disableGoPrevious: boolean
  disableGoNext: boolean
}

const useStyles = makeStyles(() => ({
  disabled: {
    cursor: 'not-allowed',
  },
}))

const ContactPageHeader: React.FC<Props> = React.memo(
  ({ onGoBack, onGoPrevious, onGoNext, disableGoPrevious, disableGoNext }) => {
    const classes = useStyles()

    return (
      <>
        <div>
          <ToolTip title="go back">
            <IconButton onClick={onGoBack}>
              <Icon name={ICONS.ArrowLeft} color="hoverLighten" size="lg" />
            </IconButton>
          </ToolTip>
          <ToolTip title={disableGoNext ? "" : "next"}>
            <IconButton onClick={onGoNext}>
              <Icon
                className={classnames(disableGoNext && classes.disabled)}
                name={ICONS.ArrowDown}
                color={disableGoNext ? 'disabled' : "hoverLighten"}
                size="lg"
              />
            </IconButton>
          </ToolTip>
          <ToolTip title={disableGoPrevious ? "" : "previous"}>
            <IconButton onClick={onGoPrevious}>
              <Icon
                className={classnames(disableGoPrevious && classes.disabled)}
                name={ICONS.ArrowUp}
                color={disableGoPrevious ? 'disabled' : "hoverLighten"}
                size="lg"
              />
            </IconButton>
          </ToolTip>
        </div>
        {/* <ToolTip title="delete contact">
          <IconButton onClick={onDelete}>
            <Icon name={ICONS.Delete} color="hoverLighten" size="lg" />
          </IconButton>
        </ToolTip> */}
      </>
    )
  },
)

export default ContactPageHeader
