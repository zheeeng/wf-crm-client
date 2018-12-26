import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Assessment from '@material-ui/icons/Assessment'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'

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
}

const ContactAssets: React.FC<Props> = React.memo(() => {
  const classes = useStyles({})

  const [currentTab, setCurrentTab] = useState(0)

  const handleCurrentTabChange = useCallback(
    (_: any, value: number) => setCurrentTab(value),
    [currentTab],
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
          <div className={classes.entry}>
            <Assessment className={classes.entryIcon} color="primary" />
            <span className={classes.entryContent}>Bicycle waiver</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
          <div className={classes.entry}>
            <Assessment className={classes.entryIcon} color="primary" />
            <span className={classes.entryContent}>ABC Tatto store Northgate</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
          <div className={classes.entry}>
            <Assessment className={classes.entryIcon} color="primary" />
            <span className={classes.entryContent}>Ski Stevens Pass in State of the blabla</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
          <div className={classes.entry}>
            <Assessment className={classes.entryIcon} color="primary" />
            <span className={classes.entryContent}>ABC Nail salon</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
          <div className={classes.entry}>
            <Assessment className={classes.entryIcon} color="primary" />
            <span className={classes.entryContent}>Whale Watch of Victoria</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
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
