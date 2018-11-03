import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Avatar from '@material-ui/core/Avatar'
import CreditCard from '@material-ui/icons/CreditCard'
import Email from '@material-ui/icons/Email'
import Phone from '@material-ui/icons/Phone'
import Cake from '@material-ui/icons/Cake'
import People from '@material-ui/icons/People'
import LocationOn from '@material-ui/icons/LocationOn'
import BookmarkBorder from '@material-ui/icons/BookmarkBorder'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'
import ContactFieldInput from '~src/units/ContactFieldInput'
import contactStore from '~src/services/contact'

const styles = (theme: Theme) => createStyles({
  profileBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  avatarBar: {
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 2,
  },
  avatarIcon: {
    padding: theme.spacing.unit * 0.5,
    height: theme.spacing.unit * 8,
    width: theme.spacing.unit * 8,
    marginRight: theme.spacing.unit * 2.5,
  },
  floatTagsWrapper: {
    float: 'right',
    maxWidth: 280,
  },
  tagsBar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
  },
  tags: {
  },
  addTagIcon: {
    marginRight: theme.spacing.unit,
  },
  tag: {
    fontSize: 14,
    padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit}px`,
    marginRight: theme.spacing.unit * 0.5,
    marginBottom: theme.spacing.unit * 0.5,
    borderRadius: theme.spacing.unit,
  },
  tagLabel: {
    padding: 0,
  },
})

export interface Props extends WithStyles<typeof styles> {
}

export interface State {
}

const ContactPageHeader: React.SFC<Props> = React.memo(props => {
  const [editable, setEditable] = React.useState(false)
  const contactContext = React.useContext(contactStore.Context)

  if (!contactContext.contact) return null

  const { classes } = props

  const handleToggleEditable = React.useCallback(
    () => {
      setEditable(!editable)
    },
    [editable],
  )

  return (
    <>
      <div className={classes.profileBar}>
        <Typography variant="h6">Profile</Typography>
        <IconButton onClick={handleToggleEditable}>
          <Edit />
        </IconButton>
      </div>
      <div>
        <div className={classes.floatTagsWrapper}>
          <div className={classes.tagsBar}>
            <Input
              placeholder="Click to add tag"
              disableUnderline
              startAdornment={<BookmarkBorder className={classes.addTagIcon} />}
            />
          </div>
          <div className={classes.tags}>
            <Chip
              clickable
              className={classes.tag}
              classes={{ label: classes.tagLabel }}
              label="Golden Tour"
            />
            <Chip
              clickable
              className={classes.tag}
              classes={{ label: classes.tagLabel }}
              label="Member"
            />
            <Chip
              clickable
              className={classes.tag}
              classes={{ label: classes.tagLabel }}
              label="Music"
            />
            <Chip
              clickable
              className={classes.tag}
              classes={{ label: classes.tagLabel }}
              label="Education"
            />
          </div>
        </div>
        <div className={classes.avatarBar}>
          <Avatar
            alt={contactContext.contact.info.name}
            src={contactContext.contact.info.avatar}
            className={classes.avatarIcon}
          />
          <strong>{contactContext.contact.info.name}</strong>
        </div>
        <ContactFieldInput
          key="name" name="name" placeholder="name" editable={editable}
          Icon={CreditCard}
          valueAndNote={{ value: contactContext.contact.info.name }}
        />
        <ContactFieldInput
          key="email" name="email" placeholder="email" editable={editable}
          Icon={Email}
          valueAndNote={[{ value: contactContext.contact.info.email, note: 'Personal' }]}
        />
        <ContactFieldInput
          key="telephone" name="telephone" placeholder="telephone" editable={editable}
          Icon={Phone}
          valueAndNote={[{ value: contactContext.contact.info.telephone, note: 'Work' }]}
        />
        <ContactFieldInput
          key="birthDay" name="birthDay" placeholder="birthDay" editable={editable}
          Icon={Cake}
          valueAndNote={{ value: contactContext.contact.info.birthDay }}
        />
        <ContactFieldInput
          key="gender" name="gender" placeholder="gender" editable={editable}
          Icon={People}
          valueAndNote={{ value: contactContext.contact.info.gender }}
        />
        <ContactFieldInput
          key="address" name="address" placeholder="address" editable={editable}
          Icon={LocationOn}
          valueAndNote={[
            { value: contactContext.contact.info.address, note: 'Home' },
            { value: contactContext.contact.info.address, note: 'Office' },
            { value: contactContext.contact.info.address, note: '' },
          ]}
        />
      </div>
    </>
  )
})

export default withStyles(styles)(ContactPageHeader)
