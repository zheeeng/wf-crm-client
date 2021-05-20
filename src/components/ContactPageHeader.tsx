import React from 'react'
import { useBoolean } from 'react-hanger'
import ToolTip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import DialogModal from '~src/units/DialogModal'

import Icon, { ICONS } from '~src/units/Icons'

export interface Props {
  onGoBack: () => void
  onGoPrevious: () => void
  onGoNext: () => void
  onDelete: () => void
  disableGoPrevious: boolean
  disableGoNext: boolean
}

const useStyles = makeStyles(() => ({
  disabled: {
    cursor: 'not-allowed',
  },
}))

const ContactPageHeader: React.FC<Props> = React.memo(
  ({
    onGoBack,
    onGoPrevious,
    onGoNext,
    onDelete,
    disableGoPrevious,
    disableGoNext,
  }) => {
    const classes = useStyles()

    const showRemoveConfirmation = useBoolean(false)

    return (
      <>
        <div>
          <ToolTip title="go back">
            <IconButton onClick={onGoBack}>
              <Icon name={ICONS.ArrowLeft} color="hoverLighten" size="lg" />
            </IconButton>
          </ToolTip>
          <ToolTip title={disableGoNext ? '' : 'next'}>
            <IconButton onClick={onGoNext}>
              <Icon
                className={classnames(disableGoNext && classes.disabled)}
                name={ICONS.ArrowDown}
                color={disableGoNext ? 'disabled' : 'hoverLighten'}
                size="lg"
              />
            </IconButton>
          </ToolTip>
          <ToolTip title={disableGoPrevious ? '' : 'previous'}>
            <IconButton onClick={onGoPrevious}>
              <Icon
                className={classnames(disableGoPrevious && classes.disabled)}
                name={ICONS.ArrowUp}
                color={disableGoPrevious ? 'disabled' : 'hoverLighten'}
                size="lg"
              />
            </IconButton>
          </ToolTip>
        </div>
        <DialogModal
          open={showRemoveConfirmation.value}
          onClose={showRemoveConfirmation.setFalse}
          handleOkClick={onDelete}
          title="Remove contact"
          content="Are you sure you want to remove this contact?"
          cancelText="Cancel"
          okText="Ok"
        />
        <ToolTip title="delete contact">
          <IconButton onClick={showRemoveConfirmation.setTrue}>
            <Icon name={ICONS.Delete} color="hoverLighten" size="lg" />
          </IconButton>
        </ToolTip>
      </>
    )
  },
)

export default ContactPageHeader
