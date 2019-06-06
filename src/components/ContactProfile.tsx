import React, { useState, useCallback, useMemo, useContext, useEffect } from 'react'
import { useBoolean } from 'react-hanger'
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
import WaiverSplitterContainer from '~src/containers/WaiverSplitter'
import useContact from '~src/containers/useContact'
import ContactFieldInput, { ContactSelectedFieldInput, FieldValue, FieldSegmentValue } from '~src/units/ContactFieldInput'
import { NameField, PhoneField, AddressField, DateField, EmailField, OtherField } from '~src/types/Contact'
import cssTips from '~src/utils/cssTips'

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
      ...{
        '&&': {
          marginLeft: 0,
          marginRight: 0,
        }
      }
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
    marginBottom: theme.spacing(2),
    borderBottom: `solid 1px ${theme.palette.grey[800]}`,
  },
  skeletonProfileBar: {
    height: theme.spacing(6),
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  profileTitle: {
    color: theme.palette.grey[800],
    fontSize: 20,
  },
  editIconBox: {
    transform: `translateX(${theme.spacing(1.5)})`,
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
    ...{
      '& img': {
        borderRadius: '50%',
      },
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
    padding: theme.spacing(0.5, 0.5, 0.5, 1),
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.grey[900],
    ...{
      '&:focus': {
        backgroundColor: theme.palette.grey[900],
      },
      '& svg': {
        margin: 0,
      },
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

const addressFieldMap = ({ id, firstLine, secondLine, country, state, city, zipcode, title, priority, waiver }: AddressField): FieldValue =>
  ({
    values: [
      { key: 'firstLine', value: firstLine || '', fieldType: 'address' },
      { key: 'secondLine', value: secondLine || '', fieldType: 'address' },
      { key: 'title', value: title || '', fieldType: 'address' },
    ],
    appendValues: [
      { key: 'country', value: country || '', fieldType: 'address' },
      { key: 'state', value: state || '', fieldType: 'address' },
      { key: 'city', value: city || '', fieldType: 'address' },
      { key: 'zipcode', value: zipcode || '', fieldType: 'address' },
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
  contactId: string
}

const ContactProfile: React.FC<Props> = React.memo(({ contactId }) => {
  const theme = useTheme<Theme>()
  const { toSplitWaiver, cancelSplitWaiver, splitDone } = useContext(WaiverSplitterContainer.Context)

  const {
    contact,
    fetchContact, isFetchingContact, fetchContactError,
    fetchFields,
    tags, addTag, removeTag,
    gender,
    addField,
    updateContactGender,
    updateField,
    removeField,
    splitWaiver,
  } = useContact(contactId)

  useEffect(
    () => { fetchContact() },
    [contactId],
  )

  const handleWaiverSplit = useCallback(
    async () => {
      cancelSplitWaiver()
      await splitWaiver(toSplitWaiver.id)
      splitDone()
    },
    [toSplitWaiver.id],
  )

  const { value: editable, toggle: toggleEditable, setFalse: toggleOffEditable } = useBoolean(false)
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
      if (value !== 'Male' && value !== 'Female' && value !== 'Other') return

      updateContactGender(value)
    },
    [updateContactGender],
  )

  const handleFieldAdd = useCallback(
    async (name: 'name' | 'email' | 'address' | 'phone' | 'date' | 'other',
      { key, value }: FieldSegmentValue, priority: number,
    ) => {
      const params: any = name !== 'date'
        ? { fieldType: name, [key]: value, priority }
        : { fieldType: name, [key]: value, priority, year: 0, month: 0, day: 0 }
      const result = await addField(params)

      return specificFieldToInputField(name)(result)
    },
    [addField],
  )

  const handleFieldUpdate = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone' | 'date'  | 'other',
      { key, value }: FieldSegmentValue,
      id: string,
      priority: number,
    ) =>
      updateField(
        {
          id,
          fieldType: name,
          [key]: value,
          priority,
        } as any
      ).then(specificFieldToInputField(name)),
    [updateField],
  )

  const handleBatchUpdateFields = useCallback(
    (name: 'name' | 'email' | 'address' | 'phone' | 'date'  | 'other',
      updateObj: any,
      id: string,
      priority: number,
    ) => updateField({ ...updateObj, id, priority, fieldType: name }).then(specificFieldToInputField(name)),
    [],
  )

  const handleAddDateField = useCallback(
    ({ year, month, day }: { year: number, month: number, day: number }, priority: number) =>
      addField({
        fieldType: 'date',
        year,
        month,
        day,
        priority,
      } as any).then(specificFieldToInputField('date')),
    [addField],
  )
  const handleUpdateDateField = useCallback(
    ({ year, month, day }: { year: number, month: number, day: number }, id: string, priority: number,
    ) =>
      updateField({
        id,
        fieldType: 'date',
        year: year,
        month: month,
        day: day,
        priority,
      } as any).then(specificFieldToInputField('date')),
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

  const [splitDialogOpened, setSplitDialogOpened] = useState(false)

  useEffect(
    () => {
      (async () => {
        if (!toSplitWaiver.id) {
          setSplitDialogOpened(false)
          toggleOffEditable()
        } else {
          await fetchFields()
          setSplitDialogOpened(true)
        }
      })()

    },
    [toSplitWaiver.id],
  )

  const [splitWaiverTitle, setSplitWaiverTitle] = useState('')

  useEffect(
    () => {
      if (toSplitWaiver.title) {
        setSplitWaiverTitle(toSplitWaiver.title)
      }
    },
    [toSplitWaiver.title]
  )

  const clearSplitWaiverTitle= useCallback(
    () => { setSplitWaiverTitle('') },
    [setSplitWaiverTitle]
  )

  const renderFields = (showName: boolean, isEditable: boolean) => (
    <>
      <ContactFieldInput
        key="name" name="name" editable={isEditable}
        fieldName="Name"
        showName={showName}
        Icon={NameIcon}
        hasTitle={false}
        expandable={true}
        fieldValues={names}
        backupFieldValue={backupNameField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onBatchUpdateFields={handleBatchUpdateFields}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactFieldInput
        key="email" name="email" editable={isEditable}
        type="email"
        fieldName="Email"
        showName={showName}
        Icon={EmailIcon}
        hasTitle={true}
        expandable={true}
        fieldValues={emails}
        backupFieldValue={backupEmailField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onBatchUpdateFields={handleBatchUpdateFields}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactFieldInput
        key="phone" name="phone" editable={isEditable}
        type="number"
        fieldName="Phone"
        showName={showName}
        Icon={PhoneIcon}
        hasTitle={true}
        expandable={true}
        fieldValues={phones}
        backupFieldValue={backupPhoneField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onBatchUpdateFields={handleBatchUpdateFields}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactFieldInput
        key="date" name="date" editable={isEditable}
        type="calendar"
        fieldName="Birthday"
        showName={showName}
        Icon={BirthdayIcon}
        hasTitle={true}
        expandable={true}
        fieldValues={dates}
        backupFieldValue={backupDateField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onUpdateDateField={handleUpdateDateField}
        onBatchUpdateFields={handleBatchUpdateFields}
        onAddDateField={handleAddDateField}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
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
        expandable={true}
        fieldValues={addresses}
        backupFieldValue={backupAddressField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onBatchUpdateFields={handleBatchUpdateFields}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
      />
      <ContactFieldInput
        key="other" name="other" editable={isEditable}
        showName={showName}
        Icon={DescriptionIcon}
        hasTitle={true}
        expandable={true}
        fieldValues={others}
        backupFieldValue={backupOtherField}
        onAddField={handleFieldAdd}
        onUpdateField={handleFieldUpdate}
        onBatchUpdateFields={handleBatchUpdateFields}
        onDeleteField={handleFieldRemove}
        onChangePriority={handleFieldPriorityChange}
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
              <Tooltip title={editable ? 'display' : 'edit'}>
                <IconButton onClick={toggleEditable} className={classes.editIconBox}>
                  {editable
                    ? <Icon name={ICONS.CheckCircle} size="lg" color="hoverLighten" />
                    : <Icon name={ICONS.Edit} size="lg" color="hoverLighten" />
                  }
                </IconButton>
              </Tooltip>
            </div>
            <div className={classes.profileContent}>
              <SplitWaiverThemeProvider>
                <Dialog
                  open={splitDialogOpened}
                  onClose={cancelSplitWaiver}
                  PaperProps={{
                    className: classnames(classes.paper, classes.splitPaper),
                  }}
                  onAnimationEnd={clearSplitWaiverTitle}
                >
                  <Typography variant="h6" align="center" color="textSecondary" className={classes.splitTitle}>
                    {splitWaiverTitle}
                  </Typography>
                  {renderFields(true, false)}
                  <div className={classes.dialogButtonZone}>
                    <Button onClick={cancelSplitWaiver}>Cancel</Button>
                    <Button color="primary" onClick={handleWaiverSplit}>Split</Button>
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
