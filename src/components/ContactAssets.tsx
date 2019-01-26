import React, { useState, useCallback, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import Assessment from '@material-ui/icons/Assessment'
import CallSplit from '@material-ui/icons/CallSplit'
import CloudDownload from '@material-ui/icons/CloudDownload'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import useContact from '~src/containers/useContact'
import NotificationContainer from '~src/containers/Notification'
import { Waiver } from '~src/types/Contact'
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
    padding: `0 ${theme.spacing.unit * 4}px`,
    height: theme.spacing.unit * 4,
    lineHeight: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit,
    ...{
      '&:hover': {
        backgroundColor: theme.palette.grey['200'],
      },
    },
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
    'color': theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}))

export interface Props {
  contactId: string
}

const ContactAssets: React.FC<Props> = React.memo(({ contactId }) => {
  const classes = useStyles({})

  const { notify } = useContext(NotificationContainer.Context)

  const [currentTab, setCurrentTab] = useState(0)

  const handleCurrentTabChange = useCallback(
    (_: any, value: number) => setCurrentTab(value),
    [currentTab],
  )

  const [waivers, setWaivers] = useState<Waiver[]>([])

  const {
    fetchWaivers, fetchWaiversError,
    splitWaiver, splitWaiverError,
   } = useContact(contactId)

  const freshWaivers = useCallback(
    async () => {
      const ws = await fetchWaivers()
      const sortedWs = ws.sort((p, c) => c.signedTimestamp - p.signedTimestamp)
      setWaivers(sortedWs)
    },
    [],
  )

  useEffect(() => { freshWaivers() }, [contactId])

  useEffect(
    () => {
      fetchWaiversError && notify(fetchWaiversError.message)
    },
    [fetchWaiversError],
  )

  const handleEntrySplit = useCallback(
    (id: string) => async () => {
      await splitWaiver(id)
      freshWaivers()
    },
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
            variant="outlined"
            color="primary"
          >Upload</Button>
        )}
      </div>
      {currentTab === 0 && (
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
                  onClick={handleEntrySplit(waiver.id)}
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
