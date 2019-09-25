import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useBoolean, useInput, usePrevious } from 'react-hanger'
import classnames from 'classnames'
import { makeStyles, useTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import Avatar from '@material-ui/core/Avatar'
import Tooltip from '@material-ui/core/Tooltip'

import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'

import SplitWaiverThemeProvider from '~src/theme/SplitWaiverThemeProvider'
import useWaiverSplitter from '~src/containers/useWaiverSplitter'
import useContact from '~src/containers/useContact'

import { ContactFieldInput, ContactSelectedFieldInput } from '~src/units/ContactFieldInput'
import { FieldValue } from '~src/units/ContactFieldInputUtils'
import { FieldType, NameField, PhoneField, AddressField, DateField, EmailField, OtherField } from '~src/types/Contact'
import cssTips from '~src/utils/cssTips'
import createEventEntry from '~src/utils/eventEntry'

import Icon, { ICONS } from '~src/units/Icons'
import Skeleton from 'react-skeleton-loader'

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
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    border: 'none',
    outline: '#efefef inset 1px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      '&&': {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  },
  splitPaper: {
    width: 618,
  },
  dialogButtonZone: {
    textAlign: 'right',
    marginTop: theme.spacing(4),
    ...cssTips(theme).horizontallySpaced(),
  },
  profileBar: {
    ...cssTips(theme).centerFlex('space-between'),
    margin: theme.spacing(0, 2),
    paddingBottom: theme.spacing(2),
  },
  profileBarScrolled: {
    boxShadow: 'inset 0 -1px 0 0 #ebebeb',
  },
  skeletonProfileBar: {
    height: theme.spacing(6),
    paddingTop: theme.spacing(2),
    margin: theme.spacing(0, 2, 2),
  },
  profileTitle: {
    color: theme.palette.grey[800],
    fontSize: 20,
  },
  editIconBox: {
    transform: `translateX(${theme.spacing(.5)}px)`,
  },
  avatarBar: {
    ...cssTips(theme).centerFlex('normal'),
    height: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  skeletonAvatarBar: {
    ...cssTips(theme).centerFlex('normal'),
    height: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  avatarName: {
    color: '#637694',
    fontWeight: 600,
    fontSize: 18,
    lineHeight: `${theme.spacing(3)}px`,
  },
  skeletonAvatarName: {
  },
  avatarIcon: {
    padding: theme.spacing(0.5),
    height: theme.spacing(7),
    width: theme.spacing(7),
    marginRight: theme.spacing(3.5),
    '& img': {
      borderRadius: '50%',
    },
  },
  skeletonAvatarIcon: {
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(3.5),
  },
  floatTagsWrapper: {
    float: 'right',
    maxWidth: 256,
    paddingLeft: theme.spacing(2),
  },
  blockTagsWrapper: {
    paddingLeft: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
  },
  skeletonContent: {
    padding: theme.spacing(0, 2),
    ...cssTips(theme).centerFlex('normal'),
  },
  skeletonContentIcon: {
    padding: theme.spacing(2.5),
    marginRight: theme.spacing(2.5),
  },
  skeletonContentText: {
    flexGrow: 1,
    flexBasis: '100%',
  },
  tagsBar: {
    ...cssTips(theme).centerFlex('normal'),
    marginBottom: theme.spacing(1),
  },
  addTagIcon: {
    marginRight: theme.spacing(1),
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  tags: {},
  tagChip: {
    fontSize: 14,
    padding: theme.spacing(0, 0.5, 0, 2.5),
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.grey[900],
    '&:focus': {
      backgroundColor: theme.palette.grey[900],
    },
    '&:hover svg': {
      visibility: 'visible',
    },
    '& svg': {
      transition: 'color .3s',
      width: theme.spacing(2.25),
      height: theme.spacing(2.25),
      marginTop: 2,
      visibility: 'hidden',
      margin: 0,
    },
    '& svg:hover': {
      color: theme.palette.primary.main,
      margin: 0,
    },
  },
  tagLabel: {
    padding: 0,
    paddingRight: theme.spacing(0.5),
  },
  progressWrapper: {
    width: '100%',
    height: '100%',
    ...cssTips(theme).centerFlex(),
  },
  progress: {
    margin: theme.spacing(2),
  },
  splitTitle: {
    marginBottom: theme.spacing(2),
  },
  profileContent: {
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('md')]: {
      flexGrow: 1,
      flexBasis: '100%',
      height: '100%',
      overflow: 'auto',
    },
  },
}))

const nameFieldMap = ({ id, firstName, middleName, lastName, title, priority, waiver }: NameField): FieldValue =>
  ({
    values: [
      { key: 'firstName', value: firstName || '' },
      { key: 'middleName', value: middleName || '' },
      { key: 'lastName', value: lastName || '' },
      { key: 'title', value: title || '' },
    ],
    id,
    priority,
    waiver,
  })

const backupNameField =
  nameFieldMap({ id: '', firstName: '', middleName: '', lastName: '', title: '', priority: 100 })

const emailFieldMap = ({ id, email, title, priority, waiver }: EmailField): FieldValue =>
  ({
    values: [
      { key: 'email', value: email || '' },
      { key: 'title', value: title || '' },
    ],
    id,
    priority,
    waiver,
  })

const backupEmailField =
  emailFieldMap({ id: '', email: '', title: '', priority: 100 })

const phoneFieldMap = ({ id, number, title, priority, waiver }: PhoneField): FieldValue =>
  ({
    values: [
      { key: 'number', value: number || '' },
      { key: 'title', value: title || '' },
    ],
    id,
    priority,
    waiver,
  })

const backupPhoneField =
  phoneFieldMap({ id: '', number: '', title: '', priority: 100 })

const dateFieldMap = ({ id, year, month, day, title, priority, waiver }: DateField): FieldValue =>
  ({
    values: [
      { key: 'year', value: year ? `${year}` : '' },
      { key: 'month', value: month ? `${month}` : '' },
      { key: 'day', value: day ? `${day}` : '' },
      { key: 'title', value: title || '' },
    ],
    id,
    priority,
    waiver,
  })

const backupDateField =
  dateFieldMap({ id: '', year: 0, month: 0, day: 0, priority: 100 })

const addressFieldMap = ({ id, firstLine, secondLine, country, state, city, zipcode, title, priority, waiver }: AddressField): FieldValue =>
  ({
    values: [
      { key: 'firstLine', value: firstLine || ''  },
      { key: 'secondLine', value: secondLine || '' },
      { key: 'title', value: title || '' },
    ],
    appendValues: [
      { key: 'city', value: city || '' },
      { key: 'state', value: state || '' },
      { key: 'country', value: country || '' },
      { key: 'zipcode', value: zipcode || '' },
    ],
    id,
    priority,
    waiver,
  })

const backupAddressField =
  addressFieldMap({ id: '', firstLine: '', secondLine: '', title: '', priority: 100 })

const otherFieldMap = ({ id, content, title, priority, waiver }: OtherField): FieldValue =>
  ({
    values: [
      { key: 'content', value: content || '' },
      { key: 'title', value: title || '' },
    ],
    id,
    priority,
    waiver,
  })

const backupOtherField =
  otherFieldMap({ id: '', content: '', title: '', priority: 100 })

const specificFieldToInputField = (fieldType: FieldType) => (
  specificField: NameField | EmailField | AddressField | PhoneField | DateField | OtherField | null,
): FieldValue | null => {
  if (specificField === null) return null

  switch (fieldType) {
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
  contactId: string
}

const ContactProfile: React.FC<Props> = React.memo(({ contactId }) => {
  const theme = useTheme<Theme>()
  const { toSplitWaiver, cancelSplitWaiver, splitDone } = useWaiverSplitter()

  const {
    contact,
    isFetchingContact, fetchContactError,
    fetchFields,
    tags, addTag, removeTag,
    gender,
    updateContactGender,
    addField,
    updateField,
    removeField,
    splitWaiver,
  } = useContact(contactId)

  const handleSplitWaiver = useCallback(
    async () => {
      cancelSplitWaiver()
      await splitWaiver(toSplitWaiver.id)
      splitDone()
    },
    [toSplitWaiver.id, cancelSplitWaiver, splitWaiver, splitDone],
  )

  const { value: editable, setTrue: toggleOnEditable, setFalse: toggleOffEditable } = useBoolean(false)
  const classes = useStyles({})

  const handleAddTags = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== 13) return
      const newTag = event.currentTarget.value.trim()
      event.currentTarget.value = ''
      if (newTag) addTag(newTag)
    },
    [addTag],
  )

  const handleDeleteTag = useCallback((tag: string) => () => removeTag(tag), [removeTag])

  const handleUpdateContactGender = useCallback(
    (value: 'Male' | 'Female' | 'Other') => ['Male', 'Female', 'Other'].includes(value) && updateContactGender(value),
    [updateContactGender],
  )

  const handleAddField = useCallback(
    async (fieldType: FieldType, obj: object, priority: number) =>
      specificFieldToInputField(fieldType)(await addField({ ...obj, fieldType, priority })),
    [addField],
  )

  const addFieldsEvents = useRef<ReturnType<typeof createEventEntry>>()

  useEffect(
    () => {
      addFieldsEvents.current = createEventEntry()

      return () => addFieldsEvents.current && addFieldsEvents.current.clean()
    },
    [],
  )

  const toggleEditable = useCallback(
    () => {
      if (!editable) return toggleOnEditable()

      addFieldsEvents.current && addFieldsEvents.current.trigger()

      toggleOffEditable()
    },
    [addFieldsEvents, editable, toggleOnEditable, toggleOffEditable],
  )

  const handleUpdateField = useCallback(
    async (fieldType: FieldType, updateObj: object, id: string, priority: number) =>
      specificFieldToInputField(fieldType)(await updateField({ ...updateObj, id, fieldType, priority })),
    [updateField],
  )

  const handleRemoveField = useCallback(
    async (fieldType: FieldType, id: string) =>
      await removeField({ fieldType, id, priority: 0 } as any),
    [removeField],
  )

  const handleChangeFieldPriority = useCallback(
    async (fieldType: FieldType, id: string, priority: number) =>
      specificFieldToInputField(fieldType)(await updateField({ id, fieldType, priority } as any)),
    [updateField],
  )

  const infoFields = useMemo<Record<'names' | 'emails' | 'phones' | 'dates' | 'addresses' | 'others', FieldValue[]>>(
    () => ({
      names: contact ? contact.info.names.map(nameFieldMap) : [],
      emails: contact ? contact.info.emails.map(emailFieldMap) : [],
      phones: contact ? contact.info.phones.map(phoneFieldMap) : [],
      dates: contact ? contact.info.dates.map(dateFieldMap) : [],
      addresses: contact ? contact.info.addresses.map(addressFieldMap) : [],
      others: contact ? contact.info.others.map(otherFieldMap) : [],
    }),
    [contact],
  )

  const [splitDialogOpened, setSplitDialogOpened] = useState(false)

  const toggleSplitter = useCallback(
    async () => {
      if (!toSplitWaiver.id) {
        setSplitDialogOpened(false)
        toggleOffEditable()
      } else {
        await fetchFields()
        setSplitDialogOpened(true)
      }
    },
    [fetchFields, toSplitWaiver.id, toggleOffEditable],
  )

  useEffect(() => { toggleSplitter() }, [toggleSplitter])

  const splitWaiverTitle = useInput('')

  useEffect(
    () => { if (toSplitWaiver.title) splitWaiverTitle.setValue(toSplitWaiver.title) },
    [toSplitWaiver.title, splitWaiverTitle],
  )

  const [scrolled, setScrolled] = useState(false)

  const handleProfileContentScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (scrolled === false && e.currentTarget.scrollTop > 0) {
        setScrolled(true)
      } else if (scrolled === true && e.currentTarget.scrollTop === 0) {
        setScrolled(false)
      }
    },
    [scrolled],
  )

  const lastContact = usePrevious(contact)

  useEffect(
    () => {
      setScrolled(false)
    },
    [lastContact]
  )

  const renderFields = (showName: boolean, isEditable: boolean) => (
    <>
      <ContactFieldInput
        key="name" name="name" editable={isEditable}
        fieldName="Name"
        showName={showName}
        Icon={NameIcon}
        hasTitle={false}
        isMultiple={true}
        fieldValues={infoFields.names}
        backupFieldValue={backupNameField}
        onAdd={handleAddField}
        bufferAdd={addFieldsEvents.current && addFieldsEvents.current.subscribe}
        onUpdate={handleUpdateField}
        onDelete={handleRemoveField}
        onChangePriority={handleChangeFieldPriority}
      />
      <ContactFieldInput
        key="email" name="email" editable={isEditable}
        type="email"
        fieldName="Email"
        showName={showName}
        Icon={EmailIcon}
        hasTitle={true}
        isMultiple={true}
        fieldValues={infoFields.emails}
        backupFieldValue={backupEmailField}
        onAdd={handleAddField}
        bufferAdd={addFieldsEvents.current && addFieldsEvents.current.subscribe}
        onUpdate={handleUpdateField}
        onDelete={handleRemoveField}
        onChangePriority={handleChangeFieldPriority}
      />
      <ContactFieldInput
        key="phone" name="phone" editable={isEditable}
        type="number"
        fieldName="Phone"
        showName={showName}
        Icon={PhoneIcon}
        hasTitle={true}
        isMultiple={true}
        fieldValues={infoFields.phones}
        backupFieldValue={backupPhoneField}
        onAdd={handleAddField}
        bufferAdd={addFieldsEvents.current && addFieldsEvents.current.subscribe}
        onUpdate={handleUpdateField}
        onDelete={handleRemoveField}
        onChangePriority={handleChangeFieldPriority}
      />
      <ContactFieldInput
        key="date" name="date" editable={isEditable}
        type="calendar"
        fieldName="Birthday"
        showName={showName}
        Icon={BirthdayIcon}
        hasTitle={true}
        isMultiple={true}
        fieldValues={infoFields.dates}
        backupFieldValue={backupDateField}
        onAdd={handleAddField}
        bufferAdd={addFieldsEvents.current && addFieldsEvents.current.subscribe}
        onUpdate={handleUpdateField}
        onDelete={handleRemoveField}
        onChangePriority={handleChangeFieldPriority}
      />
      <ContactSelectedFieldInput
        key="gender" name="gender" editable={isEditable}
        fieldName="Gender"
        showName={showName}
        Icon={GenderIcon}
        hasTitle={false}
        value={gender || ''}
        options={['', 'Male', 'Female', 'Other']}
        updateField={handleUpdateContactGender}
      />
      <ContactFieldInput
        key="address" name="address" editable={isEditable}
        type="address"
        fieldName="Address"
        showName={showName}
        Icon={LocationIcon}
        hasTitle={true}
        isMultiple={true}
        fieldValues={infoFields.addresses}
        backupFieldValue={backupAddressField}
        onAdd={handleAddField}
        bufferAdd={addFieldsEvents.current && addFieldsEvents.current.subscribe}
        onUpdate={handleUpdateField}
        onDelete={handleRemoveField}
        onChangePriority={handleChangeFieldPriority}
      />
      <ContactFieldInput
        key="other" name="other" editable={isEditable}
        fieldName="Other"
        showName={showName}
        Icon={DescriptionIcon}
        hasTitle={true}
        isMultiple={true}
        fieldValues={infoFields.others}
        backupFieldValue={backupOtherField}
        onAdd={handleAddField}
        bufferAdd={addFieldsEvents.current && addFieldsEvents.current.subscribe}
        onUpdate={handleUpdateField}
        onDelete={handleRemoveField}
        onChangePriority={handleChangeFieldPriority}
      />
    </>
  )

  const renderTags = (isFloating: boolean) => !editable && (
    <Hidden lgDown={isFloating} xlUp={!isFloating}>
      <div className={isFloating ? classes.floatTagsWrapper : classes.blockTagsWrapper}>
        <div className={classes.tagsBar}>
          <Input
            placeholder="Click to add tag"
            disableUnderline
            startAdornment={<Icon name={ICONS.Tag} className={classes.addTagIcon} />}
            onKeyDown={handleAddTags}
          />
        </div>
        <div className={classes.tags}>
          {tags.map((tag, index) => (
            <Chip
              key={`${tag}-${index}`}
              onDelete={handleDeleteTag(tag)}
              className={classes.tagChip}
              classes={{ label: classes.tagLabel }}
              label={tag}
            />
          ))}
        </div>
      </div>
    </Hidden>
  )

  return isFetchingContact
    ? (
      <>
        <div className={classes.skeletonProfileBar}>
          <Typography variant="h4" className={classes.profileTitle}>
            <Skeleton widthRandomness={0} height="100%"/>
          </Typography>
        </div>
        <div className={classes.skeletonAvatarBar}>
          <div className={classes.skeletonAvatarIcon}>
            <Skeleton widthRandomness={0} width={`${theme.spacing(7)}px`} height={`${theme.spacing(7)}px`} borderRadius="50%" />
          </div>
          <span className={classes.skeletonAvatarName}>
            <Skeleton widthRandomness={0} height={`${theme.spacing(3)}px`}/>
          </span>
        </div>
        <div>
          {Array.from(({ length: 6 }), (_, index) => (
            <div className={classes.skeletonContent} key={index}>
              <div className={classes.skeletonContentIcon}>
                <Skeleton widthRandomness={0} width={`${theme.spacing(3)}px`} height={`${theme.spacing(3)}px`} borderRadius="50%" />
              </div>
              <div className={classes.skeletonContentText}>
                <Skeleton widthRandomness={0} width="100%" height={`${theme.spacing(3)}px`} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
    : fetchContactError
      ? <Typography align="center">Oops, an error occurred!</Typography>
      : contact
        ? (
          <>
            <div
              className={classnames(
                classes.profileBar,
                scrolled && classes.profileBarScrolled,
              )}
            >
              <Typography variant="h4" className={classes.profileTitle}>
                Profile
              </Typography>
              <Tooltip title={editable ? 'done' : 'edit'}>
                <IconButton onClick={toggleEditable} className={classes.editIconBox}>
                  {editable
                    ? <Icon name={ICONS.CheckCircle} size="lg" color="hoverLighten" />
                    : <Icon name={ICONS.Edit} size="lg" color="hoverLighten" />
                  }
                </IconButton>
              </Tooltip>
            </div>
            <div
              className={classes.profileContent}
              onScroll={handleProfileContentScroll}
            >
              <SplitWaiverThemeProvider>
                <Dialog
                  open={splitDialogOpened}
                  onClose={cancelSplitWaiver}
                  PaperProps={{
                    className: classnames(classes.paper, classes.splitPaper),
                  }}
                  onAnimationEnd={splitWaiverTitle.clear}
                >
                  <Typography variant="h6" align="center" color="textSecondary" className={classes.splitTitle}>
                    {splitWaiverTitle.value}
                  </Typography>
                  {renderFields(true, false)}
                  <div className={classes.dialogButtonZone}>
                    <Button onClick={cancelSplitWaiver}>Cancel</Button>
                    <Button color="primary" onClick={handleSplitWaiver}>Split</Button>
                  </div>
                </Dialog>
              </SplitWaiverThemeProvider>
              {renderTags(true)}
              <div className={classes.avatarBar}>
                <Avatar
                  alt={contact.info.name}
                  src={contact.info.avatar}
                  className={classes.avatarIcon}
                />
                <span className={classes.avatarName}>{contact.info.name}</span>
              </div>
              {renderTags(false)}
              {renderFields(false, editable)}
            </div>
          </>
        )
        : null
})

export default ContactProfile
