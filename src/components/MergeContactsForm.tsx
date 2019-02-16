import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import cssTips from '~src/utils/cssTips'
import useToggle from '~src/hooks/useToggle'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: Math.min(theme.breakpoints.values.sm, 388),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    border: 'none',
    outline: '#efefef inset 1px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  buttonZone: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 4,
    ...cssTips(theme).horizontallySpaced,
  },
}))

export interface Props {
  open: boolean,
  onClose: () => void,
  onOk: () => Promise<any>,
}

const MergeContactsForm: React.FC<Props> = React.memo(({ open, onClose, onOk }) => {
  const classes = useStyles({})
  const { value: isLoading, toggleOn: toggleOnLoading, toggleOff: toggleOffLoading } = useToggle(false)

  const handleOkClick = useCallback(
    async () => {
      toggleOnLoading()
      await onOk()
      toggleOffLoading()
      onClose()
    },
    [onOk],
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <Typography variant="h6" align="center" color="textSecondary">
          Merge contacts
        </Typography>
        {isLoading
          ? (
            <Typography>Merging...</Typography>
          )
          : (
            <Typography>Are you sure you want to merge the selected contact?</Typography>
          )
        }
        <div className={classes.buttonZone}>
          <Button onClick={onClose}>No</Button>
          <Button
            color="primary"
            onClick={handleOkClick}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
})

export default MergeContactsForm
