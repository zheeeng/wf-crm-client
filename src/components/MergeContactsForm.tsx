import React, { useCallback } from 'react'
import { useBoolean } from 'react-hanger'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import cssTips from '~src/utils/cssTips'

import ProgressLoading from '~src/units/ProgressLoading'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    ...cssTips(theme).centerFlex(),
    width: Math.min(theme.breakpoints.values.sm, 388),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    border: 'none',
    outline: '#efefef inset 1px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  progress: {
    margin: theme.spacing(4, 2),
  },
  buttonZone: {
    width: '100%',
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
  textAlignFixed: {
    padding: theme.spacing(0, 6),
  },
}))

export interface Props {
  open: boolean
  onClose: () => void
  onOk: () => Promise<any>
}

const MergeContactsForm: React.FC<Props> = React.memo(({ open, onClose, onOk }) => {
  const classes = useStyles({})
  const { value: isLoading, setTrue: toggleOnLoading, setFalse: toggleOffLoading } = useBoolean(false)

  const handleOkClick = useCallback(
    async () => {
      try {
        toggleOnLoading()
        await onOk()
      } finally {
        onClose()
        toggleOffLoading()
      }
    },
    [onOk, onClose, toggleOnLoading, toggleOffLoading],
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: classes.paper,
      }}
    >
      {isLoading
        ? (
          <>
            <Typography variant="h6" align="center"  color="textSecondary">
              Merging...
            </Typography>
            <ProgressLoading className={classes.progress} />
          </>
        )
        : (
          <>
            <Typography variant="h6" align="center" color="textSecondary">
              Merge contacts
            </Typography>
            <Typography
              color="textSecondary"
              align="left"
              className={classnames(classes.text, classes.textAlignFixed)}
            >Are you sure you want to merge the selected contacts?</Typography>
            <div className={classes.buttonZone}>
              <Button onClick={onClose}>No</Button>
              <Button
                color="primary"
                onClick={handleOkClick}
              >
                Yes
              </Button>
            </div>
          </>
        )
      }
    </Dialog>
  )
})

export default MergeContactsForm
