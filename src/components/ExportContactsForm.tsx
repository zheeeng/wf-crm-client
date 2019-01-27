import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import AlertContainer from '~src/containers/Alert'
import ContactsContainer from '~src/containers/Contacts'
import CheckCircle from '@material-ui/icons/CheckCircle'

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
    const { success, fail } = useContext(AlertContainer.Context)
    const { exportContacts, exportContactsStatus, exportStatusError } = useContext(ContactsContainer.Context)
    const classes = useStyles({})

    useEffect(
      () => {
        if ((exportContactsStatus && exportContactsStatus.ready === true) || exportStatusError) {
          onClose()
          success(<><CheckCircle /> Contacts Exported</>)
        }
        exportStatusError && fail('Exported contacts failed')
      },
      [exportContactsStatus, exportStatusError],
    )

    useEffect(
      () => {
        if (open && contactIds.length) {
          exportContacts(contactIds)
        }
      },
      [open],
    )

    return (
      <Modal
        open={open}
        onClose={onClose}
      >
        <div className={classes.paper}>
          <Typography variant="h5" align="center">
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
