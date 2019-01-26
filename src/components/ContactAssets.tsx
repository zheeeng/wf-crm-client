import React, { useState, useCallback, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Assessment from '@material-ui/icons/Assessment'
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
    marginBottom: theme.spacing.unit * 2,
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
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
