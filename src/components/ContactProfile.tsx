import React, { useCallback, useMemo, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import CheckCircle from '@material-ui/icons/CheckCircle'
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

import NotificationContainer from '~src/containers/Notification'
import useContact from '~src/containers/useContact'
import ContactFieldInput, { FieldValue, FieldSegmentValue } from '~src/units/ContactFieldInput'
import useToggle from '~src/hooks/useToggle'
import { Contact, NameField, PhoneField, AddressField, EmailField } from '~src/types/Contact'

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

const nameFieldMap = ({ id, firstName, middleName, lastName, title, priority }: NameField): FieldValue =>
  ({
    values: [
      { key: 'firstName', value: firstName || '', fieldType: 'name' },
      { key: 'middleName', value: middleName || '', fieldType: 'name' },
      { key: 'lastName', value: lastName || '', fieldType: 'name' },
      { key: 'title', value: title || '', fieldType: 'name' },
    ],
    id,
    priority,
  })
const backupNameField =
  nameFieldMap({ id: '', firstName: '', middleName: '', lastName: '', title: '', fieldType: 'name', priority: 100 })

const emailFieldMap = ({ id, email, title, priority }: EmailField): FieldValue =>
  ({
    values: [
      { key: 'email', value: email || '', fieldType: 'email' },
      { key: 'title', value: title || '', fieldType: 'email' },
    ],
    id,
    priority,
  })

const backupEmailField =
  emailFieldMap({ id: '', email: '', title: '', fieldType: 'email', priority: 100 })

// tslint:disable-next-line:variable-name
const phoneFieldMap = ({ id, number, title, priority }: PhoneField): FieldValue =>
  ({
    values: [
      { key: 'number', value: number || '', fieldType: 'phone' },
      { key: 'title', value: title || '', fieldType: 'phone' },
    ],
    id,
    priority,
  })

const backupPhoneField =
  phoneFieldMap({ id: '', number: '', title: '', fieldType: 'phone', priority: 100 })

const addressFieldMap = ({ id, firstLine, secondLine, title, priority }: AddressField): FieldValue =>
  ({
    values: [
      { key: 'firstLine', value: firstLine || '', fieldType: 'address' },
      { key: 'secondLine', value: secondLine || '', fieldType: 'address' },
      { key: 'title', value: title || '', fieldType: 'address' },
    ],
    id,
    priority,
  })

const backupAddressField =
  addressFieldMap({ id: '', firstLine: '', secondLine: '', title: '', fieldType: 'address', priority: 100 })

const specificFieldToInputField = (fieldType: 'name' | 'address' | 'email' | 'phone') => (
  specificField: NameField | EmailField | AddressField | PhoneField | null,
): FieldValue | null => {
  if (specificField === null) return null

  specificField.fieldType = fieldType

  switch (specificField.fieldType) {
    case 'name': {
      return nameFieldMap(specificField)
    }
    case 'email': {
      return emailFieldMap(specificField)
    }
    case 'phone': {
      return phoneFieldMap(specificField)
    }
    case 'address': {
      return addressFieldMap(specificField)
    }
    default: {
      throw Error('invalid data')
    }
  }
}

export interface Props {
  contact: Contact,
  contactId: string,
}

const ContactProfile: React.FC<Props> = React.memo(({ contact, contactId }) => {
  const { notify } = useContext(NotificationContainer.Context)

  const {
    tags, addTag, removeTag,
    addField, addFieldError,
    updateField, updateFieldError,
    removeField, removeFieldError,
  } = useContact(contactId)

  useEffect(
    () => {
      addFieldError && notify(addFieldError.message)
    },
    [addFieldError],
  )
  useEffect(
    () => {
      updateFieldError && notify(updateFieldError.message)
    },
    [updateFieldError],
  )
  useEffect(
    () => {
      removeFieldError && notify(removeFieldError.message)
    },
    [removeFieldError],
  )

  const { value: editable, toggle: toggleEditable } = useToggle(false)
  const classes = useStyles({})

  const handleTagsAdd = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== 13) return
      const newTag = event.currentTarget.value.trim()
      event.currentTarget.value = ''
      if (newTag) addTag(newTag)
    },
    [addTag],
  )

  const handleTagDelete = useCallback((tag: string) => () => removeTag(tag), [removeTag])

  const handleFieldAdd = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone', { key, value }: FieldSegmentValue) =>
      addField({
        fieldType: name,
        [key]: value,
        priority: 80,
      } as any).then(specificFieldToInputField(name)),
    [addField],
  )
  const handleFieldUpdate = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone', { key, value }: FieldSegmentValue, id: string) =>
      updateField({
        id,
        fieldType: name,
        [key]: value,
        priority: 80,
      } as any).then(specificFieldToInputField(name)),
    [updateField],
  )
  const handleFieldRemove = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone', id: string) =>
      removeField({
        id,
        fieldType: name,
        priority: 0,
      } as any),
    [removeField],
  )

  const handleFieldHide = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone', priority: number, id: string) =>
      updateField({
        id,
        fieldType: name,
        priority,
      } as any).then(specificFieldToInputField(name)),
    [updateField],
  )

  const names = useMemo<FieldValue[]>(
    () => contact.info.names.map(nameFieldMap),
    [contact],
  )
  const emails = useMemo<FieldValue[]>(
    () => contact.info.emails.map(emailFieldMap),
    [contact],
  )
  const phones = useMemo<FieldValue[]>(
    () => contact.info.phones.map(phoneFieldMap),
    [contact],
  )
  const addresses = useMemo<FieldValue[]>(
    () => contact.info.addresses.map(addressFieldMap),
    [contact],
  )

  return (
    <>
      <div className={classes.profileBar}>
        <Typography variant="h6">Profile</Typography>
        <IconButton onClick={toggleEditable}>
          {editable ? <CheckCircle /> : <Edit />}
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
          key="name" name="name" editable={editable}
          Icon={CreditCard}
          hasTitle={false}
          expandable={true}
          fieldValues={names}
          backupFieldValue={backupNameField}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={handleFieldRemove}
          onToggleHideField={handleFieldHide}
        />
        <ContactFieldInput
          key="email" name="email" editable={editable}
          Icon={Email}
          hasTitle={true}
          expandable={true}
          fieldValues={emails}
          backupFieldValue={backupEmailField}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={handleFieldRemove}
          onToggleHideField={handleFieldHide}
        />
        <ContactFieldInput
          key="phone" name="phone" editable={editable}
          Icon={Phone}
          hasTitle={true}
          expandable={true}
          fieldValues={phones}
          backupFieldValue={backupPhoneField}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={handleFieldRemove}
          onToggleHideField={handleFieldHide}
        />
        {/* <FieldInput
          key="gender" name="gender" editable={editable}
          Icon={People}
          hasTitle={false}
          expandable={false}
          fieldValues={gender}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={handleFieldRemove}
          onToggleHideField={handleFieldHide}
        /> */}
        <ContactFieldInput
          key="address" name="address" editable={editable}
          Icon={LocationOn}
          hasTitle={true}
          expandable={true}
          fieldValues={addresses}
          backupFieldValue={backupAddressField}
          onAddField={handleFieldAdd}
          onUpdateField={handleFieldUpdate}
          onDeleteField={handleFieldRemove}
          onToggleHideField={handleFieldHide}
        />
      </div>
    </>
  )
})

export default ContactProfile
