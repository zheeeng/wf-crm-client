import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Assessment from '@material-ui/icons/Assessment'
import contactStore from '~src/services/contact'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'

const styles = (theme: Theme) => createStyles({
  tabsWrapper: {
    display: 'flex',
    alignItems: 'center',
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
    width: 160,
    textAlign: 'right',
    fontSize: '0.75rem',
  },
})

export interface Props extends WithStyles<typeof styles> {
}

export interface State {
}

const ContactAssets: React.SFC<Props> = React.memo(props => {
  const contactContext = React.useContext(contactStore.Context)

  const [currentTab, setCurrentTab] = React.useState(0)

  const handleCurrentTabChange = React.useCallback(
    (_: any, value: number) => setCurrentTab(value),
    [currentTab],
  )

  if (!contactContext.contact) return null

  const { classes } = props

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

export default withStyles(styles)(ContactAssets)
