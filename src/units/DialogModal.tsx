import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import cssTips from '~src/utils/cssTips'

export const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    border: 'none',
    outline: '#efefef inset 1px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      '&&': {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  },
  buttonZone: {
    ...cssTips(theme).horizontallySpaced(),
    textAlign: 'right',
    marginTop: theme.spacing(4),
    '& button': {
      fontWeight: 600,
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
  handleOkClick: () => void
  title: string,
  content: string
  okText?: string
  cancelText?: string
}

const DialogModal: React.FC<Props> = ({ open, onClose, handleOkClick, title, content, okText = 'Yes', cancelText = 'No' }) => {
  const classes = useStyles({})

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: classes.paper,
      }}
    >
      <Typography variant="h6" align="center" color="textSecondary">
        {title}
      </Typography>
      <Typography
        color="textSecondary"
        className={classnames(classes.text, classes.textAlignFixed)}
      >
        {content}
      </Typography>
      <div className={classes.buttonZone}>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button
          color="primary"
          onClick={handleOkClick}
        >
          {okText}
        </Button>
      </div>
    </Dialog>
  )
}

export default DialogModal
