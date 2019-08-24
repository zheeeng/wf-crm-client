import React from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme: Theme) => ({
  toolTip: {
    marginTop: theme.spacing(-1),
    marginLeft: theme.spacing(-2),
  },
  fieldNameWrapper: {
  },
  fieldName: {
    padding: theme.spacing(2.5),
    height: theme.spacing(8),
    width: theme.spacing(16),
    marginRight: theme.spacing(2.5),
    textAlign: 'left',
  },
  fieldIcon: {
    padding: theme.spacing(2.5),
    height: theme.spacing(8),
    width: theme.spacing(8),
    marginRight: theme.spacing(2.5),
  },
  fieldTitle: {
    display: 'flex',
  },
  fieldTitleIcon: {
    paddingLeft: 0,
    marginRight: 0,
  },
  fieldTitleName: {
    paddingLeft: 0,
  },
}))


export type LabelWithIconProps = {
  Icon: React.ComponentType<{ className?: string, color?: any }>
  fieldName: string
}

export const LabelWithIcon: React.FC<LabelWithIconProps> = ({ Icon, fieldName }) =>
{
  const classes = useStyles({})

  return (
    <div className={classes.fieldNameWrapper}>
      <Tooltip title={fieldName} classes={{ tooltip: classes.toolTip }}>
        <div><Icon className={classes.fieldIcon} /></div>
      </Tooltip>
    </div>
  )
}

export type LabelWithTextProps = {
  Icon?: React.ComponentType<{ className?: string, color?: any }>
  fieldName: string
}

export const LabelWithText: React.FC<LabelWithTextProps> = ({ Icon, fieldName }) => {
  const classes = useStyles({})

  return (
    <div className={classes.fieldTitle}>
      {Icon && (
        <div>
          <Tooltip title={fieldName}>
            <div><Icon className={classnames(classes.fieldIcon, classes.fieldTitleIcon)} /></div>
          </Tooltip>
        </div>
      )}
      <Typography
        variant="h6"
        className={classnames(
          classes.fieldName,
          classes.fieldTitleName,
        )}
        color="textSecondary"
      >
        {fieldName}
      </Typography>
    </div>
  )
}
