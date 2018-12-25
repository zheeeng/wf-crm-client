import React, { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Avatar from '@material-ui/core/Avatar'
import CreditCard from '@material-ui/icons/CreditCard'
import Email from '@material-ui/icons/Email'
import Phone from '@material-ui/icons/Phone'
import People from '@material-ui/icons/People'
import LocationOn from '@material-ui/icons/LocationOn'
import BookmarkBorder from '@material-ui/icons/BookmarkBorder'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'
import ContactFieldInput, { FieldValue } from '~src/units/ContactFieldInput'
import useToggle from '~src/hooks/useToggle'
import { Contact, CommonField, NameField, PhoneField, AddressField, EmailField } from '~src/types/Contact'

const useStyles = makeStyles((theme: Theme) => ({
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
  addTagIcon: {
    marginRight: theme.spacing.unit,
  },
  tags: {},
  tag: {
    fontSize: 14,
    padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit}px`,
    marginRight: theme.spacing.unit * 0.5,
    marginBottom: theme.spacing.unit * 0.5,
    borderRadius: theme.spacing.unit,
    ...{
      '& svg': {
        display: 'none',
      },
      '&:hover $tagLabel': {
        paddingRight: theme.spacing.unit * 1.5,
      },
      '&:hover svg': {
        display: 'block',
      },
    },
  },
  tagLabel: {
    padding: 0,
  },
}))

const specificFieldToInputField = (fieldType: 'name' | 'address' | 'email' | 'phone') => (
  specificField: NameField | EmailField | AddressField | PhoneField | null,
): FieldValue | null => {
  if (specificField === null) return null

  specificField.fieldType = fieldType

  switch (specificField.fieldType) {
    case 'name': {
      return {
        id: specificField.id,
        title: specificField.title || '',
        value: specificField.firstName || '',
      }
    }
    case 'address': {
      return {
        id: specificField.id,
        title: specificField.title || '',
        value: specificField.firstLine || '',
      }
    }
    case 'email': {
      return {
        id: specificField.id,
        title: specificField.title || '',
        value: specificField.email || '',
      }
    }
    case 'phone': {
      return {
        id: specificField.id,
        title: specificField.title || '',
        value: specificField.number || '',
      }
    }
    default: {
      throw Error('invalid data')
    }
  }
}

export interface Props {
  contact: Contact,
  tags: string[],
  addTag (tag: string): void
  removeTag (tag: string): void
  addField<F extends CommonField = CommonField> (field: F): Promise<F | null>
  updateField<F extends CommonField = CommonField> (field: F): Promise<F | null>
  removeField (fieldId: string): void
}

const ContactProfile: React.FC<Props> = React.memo(({
  contact, tags, addTag, removeTag,
  addField, updateField, removeField,
}) => {
  const { value: editable, toggle: toggleEditable } = useToggle(false)
  const classes = useStyles({})

  const handleTagsAdd = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== 13) return
      const newTag = event.currentTarget.value.trim()
      event.currentTarget.value = ''
      if (newTag) addTag(newTag)
    },
    [],
  )

  const handleTagDelete = useCallback((tag: string) => () => removeTag(tag), [])

  const handleFieldAdd = useCallback(
    (name: string, fieldValue: FieldValue) => {
      switch (name) {
        case 'name': {
          return addField<NameField>({
            fieldType: name,
            firstName: fieldValue.value,
            title: fieldValue.title || '',
            priority: 80,
          }).then(specificFieldToInputField('name'))
        }
        case 'email': {
          return addField<EmailField>({
            fieldType: name,
            email: fieldValue.value,
            title: fieldValue.title || '',
            priority: 80,
          }).then(specificFieldToInputField('email'))
        }
        case 'phone': {
          return addField<PhoneField>({
            fieldType: name,
            number: fieldValue.value,
            title: fieldValue.title || '',
            priority: 80,
          }).then(specificFieldToInputField('phone'))
        }
        case 'address': {
          return addField<AddressField>({
            fieldType: name,
            firstLine: fieldValue.value,
            title: fieldValue.title || '',
            priority: 80,
          }).then(specificFieldToInputField('address'))
        }
        default: {
          throw Error('invalid type')
        }
      }
    },
    [],
  )
  const handleFieldUpdate = useCallback(
    (name: string, fieldValue: FieldValue) => {
      switch (name) {
        case 'name': {
          return updateField<NameField>({
            id: fieldValue.id,
            fieldType: name,
            firstName: fieldValue.value,
            title: fieldValue.title || '',
            priority: 80,
          }).then(specificFieldToInputField('name'))
        }
        case 'email': {
          return updateField<EmailField>({
            id: fieldValue.id,
            fieldType: name,
            email: fieldValue.value,
            title: fieldValue.title || '',
            priority: 80,
          }).then(specificFieldToInputField('email'))
        }
        case 'phone': {
          return updateField<PhoneField>({
            id: fieldValue.id,
            fieldType: name,
            number: fieldValue.value,
            title: fieldValue.title || '',
            priority: 80,
          }).then(specificFieldToInputField('phone'))
        }
        case 'address': {
          return updateField<AddressField>({
            id: fieldValue.id,
            fieldType: name,
            firstLine: fieldValue.value,
            title: fieldValue.title || '',
            priority: 80,
          }).then(specificFieldToInputField('address'))
        }
        default: {
          throw Error('invalid field values')
        }
      }
    },
    [],
  )

  const names = useMemo(
    () => contact.info.names.map(specificFieldToInputField('name')).filter((i): i is FieldValue => i !== null),
    [contact],
  )
  const emails = useMemo(
    () => contact.info.emails.map(specificFieldToInputField('email')).filter((i): i is FieldValue => i !== null),
    [contact],
  )
  const phones = useMemo(
    () => contact.info.phones.map(specificFieldToInputField('phone')).filter((i): i is FieldValue => i !== null),
    [contact],
  )
  const addresses = useMemo(
    () => contact.info.addresses.map(specificFieldToInputField('address')).filter((i): i is FieldValue => i !== null),
    [contact],
  )

  return (
    <>
      <div className={classes.profileBar}>
        <Typography variant="h6">Profile</Typography>
        <IconButton onClick={toggleEditable}>
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
              onKeyDown={handleTagsAdd}
            />
          </div>
          <div className={classes.tags}>
            {tags.map((tag, index) => (
              <Chip
                key={`${tag}-${index}`}
                onDelete={handleTagDelete(tag)}
                className={classes.tag}
                classes={{ label: classes.tagLabel }}
                label={tag}
              />
            ))}
          </div>
        </div>
        <div className={classes.avatarBar}>
          <Avatar
            alt={contact.info.name}
            src={contact.info.avatar}
            className={classes.avatarIcon}
          />
          <strong>{contact.info.name}</strong>
        </div>
        <ContactFieldInput
          key="name" name="name" placeholder="name" editable={editable}
          Icon={CreditCard}
          hasTitle={false}
          expandable={true}
          fieldValues={names}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={removeField}
        />
        <ContactFieldInput
          key="email" name="name" placeholder="email" editable={editable}
          Icon={Email}
          hasTitle={true}
          expandable={true}
          fieldValues={emails}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={removeField}
        />
        <ContactFieldInput
          key="phone" name="phone" placeholder="phone" editable={editable}
          Icon={Phone}
          hasTitle={true}
          expandable={true}
          fieldValues={phones}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={removeField}
        />
        {/* <ContactFieldInput
          key="gender" name="gender" placeholder="gender" editable={editable}
          Icon={People}
          hasTitle={false}
          expandable={false}
          fieldValues={gender}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={removeField}
        /> */}
        <ContactFieldInput
          key="address" name="address" placeholder="address" editable={editable}
          Icon={LocationOn}
          hasTitle={true}
          expandable={true}
          fieldValues={addresses}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={removeField}
        />
      </div>
    </>
  )
})

export default ContactProfile
