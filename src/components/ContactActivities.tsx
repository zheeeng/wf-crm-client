import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import AddCircle from '@material-ui/icons/AddCircle'
import contactStore from '~src/services/contact'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import { Activity } from '~src/types/Contact'

const styles = (theme: Theme) => createStyles({
  headWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 2,
  },
  activityLabel: {
    fontSize: 20,
    fontWeight: 600,
  },
  dot: {
    width: theme.spacing.unit,
    height: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 0 ${theme.spacing.unit * 0.5}px ${theme.spacing.unit * 0.25}px ${theme.palette.primary.light}`,
    borderRadius: '50%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 3,
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
  },
  entryContent: {
    flex: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  entryTime: {
    width: 80,
    textAlign: 'right',
    fontSize: '0.75rem',
  },
  buttonWrapper: {
    textAlign: 'right',
  },
})

export interface Props extends WithStyles<typeof styles> {
  id: string
}

const ContactAssets: React.FC<Props> = React.memo(({ classes, id }) => {
  const contactContext = React.useContext(contactStore.Context)

  const ActivityGroups = React.useMemo(
    () => {
      if (!contactContext.contact) return []
      const activities = contactContext.contact.info.activities
        .slice().sort((p, c) => p.timeStamp - c.timeStamp)
      const groupMap: { [key: string]: Activity[] } = activities.reduce(
        (m, act) => {
          m[act.date] = m[act.date] ? [...m[act.date], act] : [act]

          return m
        },
        {},
      )
      const activityGroups = Object.keys(groupMap).map(key => ({
        date: key,
        activities: groupMap[key],
      }))

      return activityGroups
    },
    [contactContext],
  )

  if (!contactContext.contact) return null

  return (
    <ContactTableThemeProvider>
      <div className={classes.headWrapper}>
        <Typography variant="h5">Activities</Typography>
        <Button
          variant="outlined"
          color="primary"
        >Manage</Button>
      </div>
      <Stepper orientation="vertical">
        {ActivityGroups.map(group => (
            <Step key={group.date} active>
              <StepLabel
                classes={{
                  label: classes.activityLabel,
                }}
                icon={<div className={classes.dot} />}
              >
                {group.date}
              </StepLabel>
              <StepContent>
                {group.activities.map(activity => (
                  <div className={classes.entry} key={activity.id}>
                    <Typography className={classes.entryContent}>{activity.content}</Typography>
                    <time className={classes.entryTime}>{activity.time}</time>
                  </div>
                ))}
              </StepContent>
            </Step>
          ))}
      </Stepper>
      <div className={classes.buttonWrapper}>
        <IconButton color="primary">
          <AddCircle />
        </IconButton>
      </div>
    </ContactTableThemeProvider>
  )
})

export default withStyles(styles)(ContactAssets)
