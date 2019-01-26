import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Assessment from '@material-ui/icons/Assessment'
import CallSplit from '@material-ui/icons/CallSplit'
import CloudDownload from '@material-ui/icons/CloudDownload'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import useContact from '~src/containers/useContact'
import NotificationContainer from '~src/containers/Notification'
import WaiverSplitterContainer from '~src/containers/WaiverSplitter'
import { getDateAndTime } from '~src/utils/getDate'

const useStyles = makeStyles((theme: Theme) => ({
  tabsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing.unit * 4}px`,
    marginBottom: theme.spacing.unit * 2,
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${theme.spacing.unit * 4.5}px`,
    height: theme.spacing.unit * 4,
    lineHeight: `${theme.spacing.unit * 4.5}px`,
    marginBottom: theme.spacing.unit,
    ...{
      '&:hover': {
        backgroundColor: theme.palette.grey['200'],
      },
    },
  },
  uploadButton: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
  },
  entryIcon: {
    marginRight: theme.spacing.unit,
  },
  entryContent: {
    flex: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  entryTime: {
    width: 128,
    textAlign: 'right',
    fontSize: '0.75rem',
    ...{
      '$entry:hover &': {
        display: 'none',
      },
    },
  },
  entryButtons: {
    display: 'none',
    ...{
      '$entry:hover &': {
        display: 'block',
      },
    },
  },
  entryButton: {
    padding: theme.spacing.unit / 2,
    marginLeft: theme.spacing.unit / 2,
  },
  entryButtonIcon: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  progressWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
}))

export interface Props {
  contactId: string
}

const ContactAssets: React.FC<Props> = React.memo(({ contactId }) => {
  const classes = useStyles({})

  const { readyToSplitWaiver, splitMutation } = useContext(WaiverSplitterContainer.Context)

  const [currentTab, setCurrentTab] = useState(0)

  const handleCurrentTabChange = useCallback(
    (_: any, value: number) => setCurrentTab(value),
    [currentTab],
  )

  const {
    waivers, fetchWaivers, isFetchingWaivers, fetchWaiversError,
   } = useContact(contactId)

  useEffect(() => { fetchWaivers() }, [contactId, splitMutation])

  const handleOpenWaiverSplitter = useCallback(
    (id: string, title: string) => () => readyToSplitWaiver(id, title),
    [],
  )

  return (
    <ContactTableThemeProvider>
      <div className={classes.tabsWrapper}>
        <Tabs
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleCurrentTabChange}
        >
          <Tab
            label={<Typography variant="h6">Waivers</Typography>}
          />
          <Tab
            label={<Typography variant="h6">Attachments</Typography>}
          />
        </Tabs>
        {currentTab === 1 && (
          <Button
            className={classes.uploadButton}
            variant="outlined"
            color="primary"
          >Upload</Button>
        )}
      </div>
      {currentTab === 0
      && isFetchingWaivers
      ? (
        <div className={classes.progressWrapper}>
          <CircularProgress className={classes.progress} size={64} />
        </div>
      )
      : fetchWaiversError
      ? (
        <Typography>Oops, an error occurred!</Typography>
      )
      : (
        <div>
          {waivers.map(waiver => (
            <div key={waiver.id} className={classes.entry}>
              <Assessment className={classes.entryIcon} color="primary" />
              <span className={classes.entryContent}>{waiver.title}</span>
              <time className={classes.entryTime}>{getDateAndTime(waiver.signedTimestamp)}</time>
              <div className={classes.entryButtons}>
                <IconButton
                  className={classes.entryButton}
                  classes={{
                    label: classes.entryButtonIcon,
                  }}
                  onClick={handleOpenWaiverSplitter(waiver.id, waiver.title)}
                >
                  <CallSplit fontSize="small" />
                </IconButton>
                <IconButton
                  className={classes.entryButton}
                  classes={{
                    label: classes.entryButtonIcon,
                  }}
                >
                  <CloudDownload fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
      {currentTab === 1 && (
        <div>
          <div className={classes.entry}>
            <Assessment className={classes.entryIcon} color="primary" />
            <span className={classes.entryContent}>agreement.pdf</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
          <div className={classes.entry}>
            <Assessment className={classes.entryIcon} color="primary" />
            <span className={classes.entryContent}>Customer_waiver.word</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
          <div className={classes.entry}>
            <Assessment className={classes.entryIcon} color="primary" />
            <span className={classes.entryContent}>Business_strategy.ppt</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
        </div>
      )}
    </ContactTableThemeProvider>
  )
})

export default ContactAssets
