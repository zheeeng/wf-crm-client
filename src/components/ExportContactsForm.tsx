import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import AlertContainer from '~src/containers/Alert'
import ContactsContainer from '~src/containers/Contacts'
import shallowEqual from '~src/utils/shallowEqual'

import checkCircleSVG from '~src/assets/icons/check-circle.svg'

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
          success(<><img src={checkCircleSVG} /> Contacts Exported</>)
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
          <Typography variant="h6" align="center"  color="textSecondary">
            Generating file...
          </Typography>
          <CircularProgress className={classes.progress} />
        </div>
      </Modal>
    )
  },
  ({ contactIds: _, ...restP }, { contactIds: __, ...restN }) => shallowEqual(restP, restN),
)

export default ExportContactsForm
