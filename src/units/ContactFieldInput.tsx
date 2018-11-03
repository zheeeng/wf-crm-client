import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import AddCircle from '@material-ui/icons/AddCircle'
import cssTips from '~src/utils/cssTips'

const styles = (theme: Theme) => createStyles({
  fieldBar: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 2,
  },
  fieldTextWrapper: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 2,
  },
  fieldTextBar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
    ...cssTips(theme, { sizeFactor: 2 }).horizontallySpaced,
  },
  fieldIcon: {
    padding: theme.spacing.unit * 2.5,
    height: theme.spacing.unit * 8,
    width: theme.spacing.unit * 8,
    marginRight: theme.spacing.unit * 2.5,
  },
  filedIconBox: {
    width: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 4,
  },
  fieldTypeText: {
    width: 128,
    padding: '6px 0 7px',
  },
  fieldInput: {
    flexGrow: 1,
  },
  addTagIcon: {
    marginRight: theme.spacing.unit,
  },
})

export interface ValueAndNote {
  value: string
  note?: string
}

export interface Props extends WithStyles<typeof styles> {
  Icon?: React.ComponentType<{ className?: string, color?: any }>,
  key: string | number,
  name: string,
  valueAndNote: ValueAndNote | ValueAndNote[],
  editable?: boolean,
  onChange?: (name: string, valueAndNote: ValueAndNote[]) => void,
  placeholder?: string,
  notePlaceholder?: string,
}

const ContactFieldInput: React.SFC<Props> = React.memo((props) => {

  const { classes, Icon, name, valueAndNote, editable = false, onChange, placeholder, notePlaceholder } = props

  const expandable = Array.isArray(valueAndNote)

  const valueAndNotes = ([] as ValueAndNote[]).concat(valueAndNote)

  return (
    <div className={classes.fieldBar}>
      {Icon && <Icon className={classes.fieldIcon} color="primary" />}
      <div className={classes.fieldTextWrapper}>
        {valueAndNotes.map((pair, index) => (
          <div className={classes.fieldTextBar} key={index}>
            <Input
              disabled={!editable}
              disableUnderline={!editable}
              className={classes.fieldInput}
              value={pair.value}
              placeholder={placeholder}
              startAdornment={
                (pair.note === undefined || editable)
                  ? undefined
                  : <strong className={classes.fieldTypeText}>{pair.note}</strong>
              }
            />
            {(pair.note !== undefined && editable) ? (
              <Input
                className={classes.fieldTypeText}
                value={pair.note}
                placeholder={notePlaceholder}
              />
            ) : undefined}
            {editable && (
              <div className={classes.filedIconBox}>
                {expandable && <AddCircle color="primary" />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

export default withStyles(styles)(ContactFieldInput)
