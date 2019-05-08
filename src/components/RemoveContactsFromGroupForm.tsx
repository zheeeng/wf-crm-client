import React, { useCallback, useContext } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import cssTips from '~src/utils/cssTips'

import GroupsContainer from '~src/containers/Groups'

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
  onOk?: (groupId: string) => Promise<any>
}

const RemoveContactsFromGroupForm: React.FC<Props> = React.memo(
  ({ open, onClose, onOk }) => {
    const classes = useStyles({})

    const { groupId } = useContext(GroupsContainer.Context)

    const handleOkClick = useCallback(
      async () => {
        onOk && await onOk(groupId)
        onClose()
      },
      [onOk, onClose]
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
          Remove contacts from group
        </Typography>
        <Typography color="textSecondary" className={classes.text}>
          Are you sure you want to remove the selected contacts from the current group?
        </Typography>
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
  },
)

export default RemoveContactsFromGroupForm