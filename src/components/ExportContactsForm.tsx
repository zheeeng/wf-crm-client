import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import AlertContainer from '~src/containers/Alert'
import ContactsContainer from '~src/containers/Contacts'
import shallowEqual from '~src/utils/shallowEqual'

import CheckCircle from '@material-ui/icons/CheckCircleOutline'
import ProgressLoading from '~src/units/ProgressLoading'

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    margin: theme.spacing(4, 2),
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
      },
      [exportContactsStatus],
    )

    useEffect(
      () => { exportStatusError && fail(exportStatusError.message) },
      [exportStatusError],
    )

    useEffect(
      () => { open && contactIds.length && exportContacts(contactIds) },
      [open],
    )

    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          className: classes.paper,
        }}
      >
        <Typography variant="h6" align="center"  color="textSecondary">
          Generating file...
        </Typography>
        <ProgressLoading className={classes.progress} />
      </Dialog>
    )
  },
  ({ contactIds: _, ...restP }, { contactIds: __, ...restN }) => shallowEqual(restP, restN),
)

export default ExportContactsForm
