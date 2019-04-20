import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import cssTips from '~src/utils/cssTips'
import useToggle from '~src/hooks/useToggle'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    border: 'none',
    outline: '#efefef inset 1px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      ...{
        '&&': {
          marginLeft: 0,
          marginRight: 0,
        }
      }
    },
  },
  progress: {
    margin: theme.spacing(2),
  },
  buttonZone: {
    textAlign: 'right',
    marginTop: theme.spacing(4),
    ...cssTips(theme).horizontallySpaced(),
    ...{
      '& button': {
        fontWeight: 600,
      },
    },
  },
  text: {
    marginTop: theme.spacing(2),
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
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: classes.paper,
      }}
    >
      <Typography variant="h6" align="center" color="textSecondary">
        Merge contacts
      </Typography>
      {isLoading
        ? (
          <Typography className={classes.text}>Merging...</Typography>
        )
        : (
          <Typography color="textSecondary" className={classes.text}>Are you sure you want to merge the selected contact?</Typography>
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
    </Dialog>
  )
})

export default MergeContactsForm
