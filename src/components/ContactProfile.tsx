import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import Avatar from '@material-ui/core/Avatar'

import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'

import AlertContainer from '~src/containers/Alert'
import WaiverSplitterContainer from '~src/containers/WaiverSplitter'
import useContact from '~src/containers/useContact'
import ContactFieldInput,
  { ContactSelectedFieldInput, FieldValue, FieldSegmentValue } from '~src/units/ContactFieldInput'
import useToggle from '~src/hooks/useToggle'
import { NameField, PhoneField, AddressField, DateField, EmailField, OtherField } from '~src/types/Contact'
import cssTips from '~src/utils/cssTips'

import Icon, { ICONS } from '~src/units/Icons'
import ProgressLoading from '~src/units/ProgressLoading'

interface IconProp {
  className?: string
}
const NameIcon: React.FC<IconProp> = ({className}) =>
  <Icon name={ICONS.Name} className={className}/>
const EmailIcon: React.FC<IconProp> = ({className}) =>
  <Icon name={ICONS.Email} className={className}/>
const PhoneIcon: React.FC<IconProp> = ({className}) =>
  <Icon name={ICONS.Phone} className={className} />
const GenderIcon: React.FC<IconProp> = ({className}) =>
  <Icon name={ICONS.Gender} className={className} />
const BirthdayIcon: React.FC<IconProp> = ({className}) =>
  <Icon name={ICONS.Birthday} className={className} />
const LocationIcon: React.FC<IconProp> = ({className}) =>
  <Icon name={ICONS.Location} className={className} />
const DescriptionIcon: React.FC<IconProp> = ({className}) =>
  <Icon name={ICONS.Description} className={className} />

const useStyles = makeStyles((theme: Theme) => ({
  modelPaper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: theme.breakpoints.values.md,
    maxHeight: '90%',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    border: 'none',
    outline: '#efefef inset 1px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
    },
  },
  modelButtonZone: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 4,
    ...cssTips(theme).horizontallySpaced(),
  },
  profileBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  profileTitle: {
    color: theme.palette.grey[800],
    fontSize: 20,
  },
  editIconBox: {
    transform: `translateX(${theme.spacing.unit * 1.5})`,
  },
  avatarBar: {
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 2,
  },
  avatarName: {
    color: '#637694',
    fontWeight: 600,
    fontSize: 18,
    lineHeight: theme.spacing.unit * 3,
  },
  avatarIcon: {
    padding: theme.spacing.unit * 0.5,
    height: theme.spacing.unit * 7,
    width: theme.spacing.unit * 7,
    marginRight: theme.spacing.unit * 3.5,
    ...{
      '& img': {
        borderRadius: '50%',
      },
    },
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
    width: theme.spacing.unit * 3,
    height: theme.spacing.unit * 3,
  },
  tags: {},
  tagChip: {
    fontSize: 14,
    padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit}px`,
    marginRight: theme.spacing.unit * 0.5,
    marginBottom: theme.spacing.unit * 0.5,
    borderRadius: theme.spacing.unit,
    backgroundColor: '#e8edf5',
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

const nameFieldMap = ({ id, firstName, middleName, lastName, title, priority, waiver }: NameField): FieldValue =>
  ({
    values: [
      { key: 'firstName', value: firstName || '', fieldType: 'name' },
      { key: 'middleName', value: middleName || '', fieldType: 'name' },
      { key: 'lastName', value: lastName || '', fieldType: 'name' },
      { key: 'title', value: title || '', fieldType: 'name' },
    ],
    id,
    priority,
    waiver,
  })
const backupNameField =
  nameFieldMap({ id: '', firstName: '', middleName: '', lastName: '', title: '', fieldType: 'name', priority: 100 })

const emailFieldMap = ({ id, email, title, priority, waiver }: EmailField): FieldValue =>
  ({
    values: [
      { key: 'email', value: email || '', fieldType: 'email' },
      { key: 'title', value: title || '', fieldType: 'email' },
    ],
    id,
    priority,
    waiver,
  })

const backupEmailField =
  emailFieldMap({ id: '', email: '', title: '', fieldType: 'email', priority: 100 })

// tslint:disable-next-line:variable-name
const phoneFieldMap = ({ id, number, title, priority, waiver }: PhoneField): FieldValue =>
  ({
    values: [
      { key: 'number', value: number || '', fieldType: 'phone' },
      { key: 'title', value: title || '', fieldType: 'phone' },
    ],
    id,
    priority,
    waiver,
  })

const backupPhoneField =
  phoneFieldMap({ id: '', number: '', title: '', fieldType: 'phone', priority: 100 })

const dateFieldMap = ({ id, year, month, day, title, priority, waiver }: DateField): FieldValue =>
  ({
    values: [
      { key: 'year', value: year ? `${year}` : '', fieldType: 'date' },
      { key: 'month', value: month ? `${month}` : '', fieldType: 'date' },
      { key: 'day', value: day ? `${day}` : '', fieldType: 'date' },
      { key: 'title', value: title || '', fieldType: 'date' },
    ],
    id,
    priority,
    waiver,
  })

const backupDateField =
  dateFieldMap({ id: '', year: 0, month: 0, day: 0, fieldType: 'date', priority: 100 })

const addressFieldMap = ({ id, firstLine, secondLine, title, priority, waiver }: AddressField): FieldValue =>
  ({
    values: [
      { key: 'firstLine', value: firstLine || '', fieldType: 'address' },
      { key: 'secondLine', value: secondLine || '', fieldType: 'address' },
      { key: 'title', value: title || '', fieldType: 'address' },
    ],
    id,
    priority,
    waiver,
  })

const backupAddressField =
  addressFieldMap({ id: '', firstLine: '', secondLine: '', title: '', fieldType: 'address', priority: 100 })

const otherFieldMap = ({ id, content, title, priority, waiver }: OtherField): FieldValue =>
  ({
    values: [
      { key: 'content', value: content || '', fieldType: 'other' },
      { key: 'title', value: title || '', fieldType: 'other' },
    ],
    id,
    priority,
    waiver,
  })

const backupOtherField =
  otherFieldMap({ id: '', content: '', title: '', fieldType: 'other', priority: 100 })

const specificFieldToInputField = (fieldType: 'name' | 'address' | 'email' | 'phone' | 'date' | 'other') => (
  specificField: NameField | EmailField | AddressField | PhoneField | DateField | OtherField | null,
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
    case 'date': {
      return dateFieldMap(specificField)
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
  const { fail } = useContext(AlertContainer.Context)
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
      addFieldError && fail('Add new field failed')
    },
    [addFieldError],
  )
  useEffect(
    () => {
      updateFieldError && fail('Update field failed')
    },
    [updateFieldError],
  )
  useEffect(
    () => {
      removeFieldError && fail('Remove field failed')
    },
    [removeFieldError],
  )

  useEffect(
    () => {
      splitWaiverError && fail('Split waiver failed')
    },
    [splitWaiverError],
  )

  const handleWaiverSplit = useCallback(
    async () => {
      cancelSplitWaiver()
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
    (name: 'name' | 'email' | 'address' | 'phone' | 'date' | 'other',
     { key, value }: FieldSegmentValue, priority: number,
    ) =>
      addField({
        fieldType: name,
        [key]: value,
        priority,
      } as any).then(specificFieldToInputField(name)),
    [addField],
  )
  const handleFieldUpdate = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone' | 'date'  | 'other',
     { key, value }: FieldSegmentValue, id: string, priority: number,
  ) =>
      updateField({
        id,
        fieldType: name,
        [key]: value,
        priority,
      } as any).then(specificFieldToInputField(name)),
    [updateField],
  )
  const handleFieldRemove = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone' | 'date' | 'other', id: string) =>
      removeField({
        id,
        fieldType: name,
        priority: 0,
      } as any),
    [removeField],
  )

  const handleFieldPriorityChange = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone' | 'date' | 'other', id: string, priority: number) =>
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
  const dates = useMemo<FieldValue[]>(
    () => contact
      ? contact.info.dates.map(dateFieldMap)
      : [],
    [contact],
  )
  const addresses = useMemo<FieldValue[]>(
    () => contact
      ? contact.info.addresses.map(addressFieldMap)
      : [],
    [contact],
  )
  const others = useMemo<FieldValue[]>(
    () => contact
      ? contact.info.others.map(otherFieldMap)
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
        fieldName="Name"
        showName={showName}
        Icon={NameIcon}
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
        fieldName="Email"
        showName={showName}
        Icon={EmailIcon}
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
        fieldName="Phone"
        showName={showName}
        Icon={PhoneIcon}
        hasTitle={true}
        expandable={true}
        fieldValues={phones}
        backupFieldValue={backupPhoneField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactFieldInput
        key="date" name="date" editable={e}
        fieldName="Birthday"
        showName={showName}
        Icon={BirthdayIcon}
        hasTitle={false}
        expandable={true}
        fieldValues={dates}
        backupFieldValue={backupDateField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactSelectedFieldInput
        key="gender" name="gender" editable={e}
        fieldName="Gender"
        showName={showName}
        Icon={GenderIcon}
        hasTitle={false}
        value={gender || ''}
        options={['', 'Male', 'Female']}
        updateField={handleUpdateContactGender}
      />
      <ContactFieldInput
        key="address" name="address" editable={e}
        fieldName="Address"
        showName={showName}
        Icon={LocationIcon}
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
        Icon={DescriptionIcon}
        hasTitle={true}
        expandable={true}
        fieldValues={others}
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
        <ProgressLoading className={classes.progress} size={64} />
      </div>
    )
    : fetchContactError
    ? (
      <Typography align="center">Oops, an error occurred!</Typography>
    )
    : contact
    ? (
      <>
        <div className={classes.profileBar}>
          <Typography variant="h4" className={classes.profileTitle}>
            Profile
          </Typography>
          <IconButton onClick={toggleEditable} className={classes.editIconBox}>
            {editable
              ? <Icon name={ICONS.CheckCircle} size="lg" color="hoverLighten" />
              : <Icon name={ICONS.Edit} size="lg" />
            }
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
                  <Typography variant="h5" align="center">
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
                  startAdornment={
                    <Icon
                      name={ICONS.Tag}
                      className={classes.addTagIcon}
                    />
                  }
                  onKeyDown={handleTagsAdd}
                />
              </div>
              <div className={classes.tags}>
                {tags.map((tag, index) => (
                  <Chip
                    key={`${tag}-${index}`}
                    onDelete={handleTagDelete(tag)}
                    className={classes.tagChip}
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
            <span className={classes.avatarName}>{contact.info.name}</span>
          </div>
          <Hidden xlUp>
            <div className={classes.blockTagsWrapper}>
              <div className={classes.tagsBar}>
                <Input
                  placeholder="Click to add tag"
                  disableUnderline
                  startAdornment={<Icon name={ICONS.Tag} className={classes.addTagIcon} />}
                  onKeyDown={handleTagsAdd}
                />
              </div>
              <div className={classes.tags}>
                {tags.map((tag, index) => (
                  <Chip
                    key={`${tag}-${index}`}
                    onDelete={handleTagDelete(tag)}
                    className={classes.tagChip}
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
