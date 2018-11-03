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
}

export interface State {
}

const ContactAssets: React.SFC<Props> = React.memo(props => {
  const contactContext = React.useContext(contactStore.Context)

  if (!contactContext.contact) return null

  const { classes } = props

  const activitiesFake: Activity[] = [
    {
      id: 'foo',
      time: 'March 15, 2017',
      content: 'Checks out',
    },
    {
      id: 'bar',
      time: 'March 16, 2018',
      content: 'Checks in',
    },
    {
      id: 'baz',
      time: 'March 18, 2018',
      content: 'Checks in out',
    },
  ]

  return (
    <ContactTableThemeProvider>
      <div className={classes.headWrapper}>
        <Typography variant="h6">Waivers</Typography>
        <Button
          variant="outlined"
          color="primary"
        >Manage</Button>
      </div>
      <Stepper orientation="vertical">
        {activitiesFake.map(activity => (
            <Step key={activity.id} active>
              <StepLabel icon={<div className={classes.dot} />}>{activity.time}</StepLabel>
              <StepContent>
                <div className={classes.entry}>
                  <Typography className={classes.entryContent}>{activity.content}</Typography>
                  <time className={classes.entryTime}>{activity.time}</time>
                </div>
                <div className={classes.entry}>
                  <Typography className={classes.entryContent}>{activity.content}</Typography>
                  <time className={classes.entryTime}>{activity.time}</time>
                </div>
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
