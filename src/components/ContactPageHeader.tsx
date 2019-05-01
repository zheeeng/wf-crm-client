import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import ToolTip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import Icon, { ICONS } from '~src/units/Icons'

const useStyles = makeStyles((theme: Theme) => ({
  tooltip: {
    fontSize: 12,
    color: 'white',
    backgroundColor: 'black',
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
        <div>
          <ToolTip title="go back" classes={{ tooltip: classes.tooltip }}>
            <IconButton onClick={onGoBack}>
              <Icon name={ICONS.ArrowLeft} color="hoverLighten" size="lg" />
            </IconButton>
          </ToolTip>
          <ToolTip title={disableGoNext ? "" : "next"} classes={{ tooltip: classes.tooltip }}>
            <IconButton onClick={onGoNext}>
              <Icon name={ICONS.ArrowDown} color={disableGoNext ? 'disabled' : "hoverLighten"} size="lg" />
            </IconButton>
          </ToolTip>
          <ToolTip title={disableGoPrevious ? "" : "previous"} classes={{ tooltip: classes.tooltip }}>
            <IconButton onClick={onGoPrevious}>
              <Icon name={ICONS.ArrowUp} color={disableGoPrevious ? 'disabled' : "hoverLighten"} size="lg" />
            </IconButton>
          </ToolTip>
        </div>
        <ToolTip title="delete contact" classes={{ tooltip: classes.tooltip }}>
          <IconButton onClick={onDelete}>
            <Icon name={ICONS.Delete} color="hoverLighten" size="lg" />
          </IconButton>
        </ToolTip>
      </>
    )
  },
)

export default ContactPageHeader
