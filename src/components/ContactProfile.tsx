import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import Edit from '@material-ui/icons/Edit'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Avatar from '@material-ui/core/Avatar'
import CreditCard from '@material-ui/icons/CreditCard'
import Email from '@material-ui/icons/Email'
import Phone from '@material-ui/icons/Phone'
import People from '@material-ui/icons/People'
import CircularProgress from '@material-ui/core/CircularProgress'
import LocationOn from '@material-ui/icons/LocationOn'
import Description from '@material-ui/icons/Description'
import BookmarkBorder from '@material-ui/icons/BookmarkBorder'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'

import NotificationContainer from '~src/containers/Notification'
import WaiverSplitterContainer from '~src/containers/WaiverSplitter'
import useContact from '~src/containers/useContact'
import ContactFieldInput,
  { ContactSelectedFieldInput, FieldValue, FieldSegmentValue } from '~src/units/ContactFieldInput'
import useToggle from '~src/hooks/useToggle'
import { NameField, PhoneField, AddressField, EmailField, OtherField } from '~src/types/Contact'
import cssTips from '~src/utils/cssTips'

const useStyles = makeStyles((theme: Theme) => ({
  modelPaper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.breakpoints.values.md,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    border: 'none',
    outline: '#efefef inset 1px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  modelButtonZone: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 4,
    ...cssTips(theme).horizontallySpaced,
  },
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
  blockTagsWrapper: {
    paddingLeft: theme.spacing.unit * 2.5,
    marginBottom: theme.spacing.unit * 2,
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
  progressWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
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

const otherFieldMap = ({ id, content, title, priority }: OtherField): FieldValue =>
  ({
    values: [
      { key: 'content', value: content || '', fieldType: 'other' },
      { key: 'title', value: title || '', fieldType: 'other' },
    ],
    id,
    priority,
  })

const backupAddressField =
  addressFieldMap({ id: '', firstLine: '', secondLine: '', title: '', fieldType: 'address', priority: 100 })

const backupOtherField =
  otherFieldMap({ id: '', content: '', title: '', fieldType: 'other', priority: 100 })

const specificFieldToInputField = (fieldType: 'name' | 'address' | 'email' | 'phone' | 'other') => (
  specificField: NameField | EmailField | AddressField | PhoneField | OtherField | null,
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
    case 'other': {
      return otherFieldMap(specificField)
    }
    default: {
      throw Error('invalid data')
    }
  }
}

export interface Props {
  contactId: string,
}

const ContactProfile: React.FC<Props> = React.memo(({ contactId }) => {
  const { notify } = useContext(NotificationContainer.Context)
  const { toSplitWaiver, cancelSplitWaiver, splitDone } = useContext(WaiverSplitterContainer.Context)

  const {
    contact,
    fetchContact, isFetchingContact, fetchContactError,
    fetchFields,
    tags, addTag, removeTag,
    gender,
    addField, addFieldError,
    updateContactGender,
    updateField, updateFieldError,
    removeField, removeFieldError,
    splitWaiver, splitWaiverError,
  } = useContact(contactId)

  useEffect(
    () => { fetchContact() },
    [contactId],
  )

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

  useEffect(
    () => {
      splitWaiverError && notify(splitWaiverError.message)
    },
    [splitWaiverError],
  )

  const handleWaiverSplit = useCallback(
    async () => {
      await splitWaiver(toSplitWaiver.id)
      splitDone()
    },
    [toSplitWaiver.id],
  )

  const { value: editable, toggle: toggleEditable, toggleOff: toggleOffEditable } = useToggle(false)
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

  const handleUpdateContactGender = useCallback(
    (value: string) => {
      if (value !== 'Male' && value !== 'Female') return

      updateContactGender(value)
    },
    [],
  )

  const handleFieldAdd = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone', { key, value }: FieldSegmentValue, priority: number) =>
      addField({
        fieldType: name,
        [key]: value,
        priority,
      } as any).then(specificFieldToInputField(name)),
    [addField],
  )
  const handleFieldUpdate = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone', { key, value }: FieldSegmentValue, id: string, priority: number) =>
      updateField({
        id,
        fieldType: name,
        [key]: value,
        priority,
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

  const handleFieldPriorityChange = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone', id: string, priority: number) =>
      updateField({
        id,
        fieldType: name,
        priority,
      } as any).then(specificFieldToInputField(name)),
    [updateField],
  )

  const names = useMemo<FieldValue[]>(
    () => contact
      ? contact.info.names.map(nameFieldMap)
      : [],
    [contact],
  )
  const emails = useMemo<FieldValue[]>(
    () => contact
      ? contact.info.emails.map(emailFieldMap)
      : [],
    [contact],
  )
  const phones = useMemo<FieldValue[]>(
    () => contact
      ? contact.info.phones.map(phoneFieldMap)
      : [],
    [contact],
  )
  const addresses = useMemo<FieldValue[]>(
    () => contact
      ? contact.info.addresses.map(addressFieldMap)
      : [],
    [contact],
  )
  const other = useMemo<FieldValue[]>(
    () => contact
      ? contact.info.other.map(otherFieldMap)
      : [],
    [contact],
  )

  const [splitModelOpened, setSplitModelOpened] = useState(false)

  useEffect(
    () => {
      (async () => {
        if (!toSplitWaiver.id) {
          setSplitModelOpened(false)
          toggleOffEditable()
        } else {
          await fetchFields()
          setSplitModelOpened(true)
        }
      })()

    },
    [toSplitWaiver.id],
  )

  const renderFields = (showName: boolean, e: boolean) => (
    <>
      <ContactFieldInput
        key="name" name="name" editable={e}
        showName={showName}
        Icon={CreditCard}
        hasTitle={false}
        expandable={true}
        fieldValues={names}
        backupFieldValue={backupNameField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactFieldInput
        key="email" name="email" editable={e}
        showName={showName}
        Icon={Email}
        hasTitle={true}
        expandable={true}
        fieldValues={emails}
        backupFieldValue={backupEmailField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactFieldInput
        key="phone" name="phone" editable={e}
        showName={showName}
        Icon={Phone}
        hasTitle={true}
        expandable={true}
        fieldValues={phones}
        backupFieldValue={backupPhoneField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactSelectedFieldInput
        key="gender" name="gender" editable={e}
        showName={showName}
        Icon={People}
        hasTitle={true}
        value={gender || ''}
        options={['', 'Male', 'Female']}
        updateField={handleUpdateContactGender}
      />
      <ContactFieldInput
        key="address" name="address" editable={e}
        showName={showName}
        Icon={LocationOn}
        hasTitle={true}
        expandable={true}
        fieldValues={addresses}
        backupFieldValue={backupAddressField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactFieldInput
        key="other" name="other" editable={e}
        showName={showName}
        Icon={Description}
        hasTitle={true}
        expandable={true}
        fieldValues={other}
        backupFieldValue={backupOtherField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
    </>
  )

  return isFetchingContact
    ? (
      <div className={classes.progressWrapper}>
        <CircularProgress className={classes.progress} size={64} />
      </div>
    )
    : fetchContactError
    ? (
      <Typography>Oops, an error occurred!</Typography>
    )
    : contact
    ? (
      <>
        <div className={classes.profileBar}>
          <Typography variant="h6">Profile</Typography>
          <IconButton onClick={toggleEditable}>
            {editable ? <CheckCircle /> : <Edit />}
          </IconButton>
        </div>
        <div>
          <Modal
            open={splitModelOpened}
            onClose={cancelSplitWaiver}
          >
            {splitModelOpened
              ? (
                <div className={classes.modelPaper}>
                  <Typography variant="subtitle1" align="center">
                    {toSplitWaiver.title}
                  </Typography>
                  {renderFields(true, false)}
                  <div className={classes.modelButtonZone}>
                    <Button
                      onClick={cancelSplitWaiver}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleWaiverSplit}
                    >
                      Split
                    </Button>
                  </div>
                </div>
              )
              : null
            }
          </Modal>
          <Hidden lgDown>
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
          </Hidden>
          <div className={classes.avatarBar}>
            <Avatar
              alt={contact.info.name}
              src={contact.info.avatar}
              className={classes.avatarIcon}
            />
            <strong>{contact.info.name}</strong>
          </div>
          <Hidden xlUp>
            <div className={classes.blockTagsWrapper}>
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
          </Hidden>
          {renderFields(false, editable)}
        </div>
      </>
    )
    : null
})

export default ContactProfile
