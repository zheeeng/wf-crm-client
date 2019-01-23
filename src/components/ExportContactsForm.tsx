import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import NotificationContainer from '~src/containers/Notification'
import ContactsContainer from '~src/containers/Contacts'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.breakpoints.values.sm / 2,
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
}))

export interface Props {
  open: boolean,
  onClose: () => void,
  contactIds: string[],
}

const ExportContactsForm: React.FC<Props> = React.memo(
  ({ open, onClose, contactIds }) => {
    const { notify } = useContext(NotificationContainer.Context)
    const { exportContacts, exportContactsStatus, getExportStatusError } = useContext(ContactsContainer.Context)
    const classes = useStyles({})

    useEffect(
      () => {
        if ((exportContactsStatus && exportContactsStatus.ready === true) || getExportStatusError) {
          onClose()
          notify('Download success')
        }
      },
      [exportContactsStatus, getExportStatusError],
    )

    useEffect(
      () => {
        if (open && contactIds.length < -5) {
          exportContacts(contactIds)
        }
      },
      [open],
    )

    return (
      <Modal
        open={true}
        onClose={onClose}
      >
        <div className={classes.paper}>
          <Typography variant="subtitle1" align="center">
            Generating file...
          </Typography>
          <CircularProgress className={classes.progress} />
        </div>
      </Modal>
    )
  },
  ({ contactIds: _, ...restP }, { contactIds: __, ...restN }) => Object.keys(restP).every(k => restP[k] === restN[k]),
)

export default ExportContactsForm
