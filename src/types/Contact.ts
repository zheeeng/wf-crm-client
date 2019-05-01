import { snake2pascal } from '~src/utils/caseConvert'
import mapKeys from '~src/utils/mapKeys'
import clearEmpty from '~src/utils/clearEmpty'
import crateGravatar from '~src/utils/createGravatar'
export interface Activity {
  id: string
  date: string
  timeStamp: number
  time: string
  content: string
  activityType: string
}

export interface ActivityAPI {
  id: string,
  account: string,
  content: string
  activity_type: string | null
  person: string
  timestamp: number
}

export interface Note {
  id: string
  content: string
  timestamp: number
}

export interface NoteAPI {
  account: string
  content: string
  id: string
  timestamp: number
}

export interface Waiver {
  id: string
  signedTimestamp: number
  title: string
}

export interface WaiverAPI {
  account: string
  id: string
  signed_timestamp: number
  waiver_key: string
  waiver_title: string
}

export interface ContactField {
  fieldType: string,
  id?: string
  priority: number
  title?: string
  waiver?: any
}

export interface NameField extends ContactField {
  fieldType: 'name',
  firstName?: string
  middleName?: string
  lastName?: string
}

export interface EmailField extends ContactField {
  fieldType: 'email',
  email?: string
}
export interface PhoneField extends ContactField {
  fieldType: 'phone',
  number?: string
}
export interface DateField extends ContactField {
  fieldType: 'date',
  year?: number
  month?: number
  day?: number
}

export interface AddressField extends ContactField {
  fieldType: 'address',
  firstLine?: string
  secondLine?: string
  city?: string
  state?: string
  zipcode?: string
  country?: string
}

export interface OtherField extends ContactField {
  fieldType: 'other'
  content?: string
  title?: string
}

export type ContactFields = Pick<PeopleAPI, 'first_name' | 'last_name' | 'country' | 'state' | 'city' | 'zipcode' | 'email' | 'phone'>

export type CommonField = NameField | EmailField | PhoneField | AddressField | DateField | OtherField

export interface Contact {
  id: string,
  info: {
    avatar: string,
    starred: boolean,
    name: string,
    names: NameField[],
    gender: 'Male' | 'Female' | 'Other' | null,
    birthDay: string,
    dates: any[],
    email: string,
    emails: EmailField[],
    address: string,
    addresses: AddressField[],
    phone: string,
    phones: PhoneField[],
    tags: string[],
    pictures: string[],
    waivers: any[],
    activities: Activity[],
    notes: Note[],
    others: OtherField[],
  }
}

export interface Group {
  id: string,
  info: {
    account: string,
    name: string,
    contacts: Contact[],
    updateTimestamp: number,
  }
}

export interface GroupAPI {
  id: string,
  account: string,
  name: string,
  last_update_timestamp: number,
}

export interface PeopleAPI {
  id: string
  favourite: boolean | null
  account: string
  name: string | null
  names?: any[]
  picture_url: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  gender: 'Male' | 'Female' | 'Other' | null
  country: string | null
  state: string | null
  city: string | null
  zipcode: string | null
  dob_day: string | null
  dob_month: string | null
  dob_year: string | null
  email: string | null
  emails?: any[]
  address: string | null
  addresses?: any[]
  phone: string | null
  phones?: any[]
  others?: any[]
  dates?: any[]
  tags: string[]
  pictures: string[],
  waivers: any[],
  activities: ActivityAPI[] | null,
  notes: NoteAPI[] | null,
}

export type GroupFields = Pick<GroupAPI, 'name'>

export const contactOutputAdapter = (output: Contact): Partial<PeopleAPI> => {
  const params = {
    email: output.info.email,
    phone: output.info.phone,
    favourite: output.info.starred,
    picture_url: output.info.avatar,
    name: output.info.name,
    gender: output.info.gender || null,
    address: output.info.address,
  }

  clearEmpty(params)

  return params
}

export const contactFieldAdapter =
  (fields: ContactFields): Partial<PeopleAPI> => fields

export const groupFieldAdapter =
  (fields: GroupFields): Partial<GroupAPI> => fields

const monthTable = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
]

export const activityInputAdapter = (input: ActivityAPI): Activity => {
  const d = new Date(input.timestamp * 1000)

  const activity = {
    id: input.id,
    timeStamp: input.timestamp * 1000,
    time: `${d.getHours() % 12}:${d.getMinutes()} ${(d.getHours() >= 12) ? 'AM' : 'PM'}`,
    date: `${monthTable[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    content: input.content,
    activityType: input.activity_type || 'activity',
  }

  return activity
}

export const activityOutputAdapter = (output: Partial<Activity>): Partial<ActivityAPI> => {
  const activity = {
    content: output.content,
    activity_type: output.activityType || 'activity',
  }

  return activity
}

export const noteInputAdapter = (input: NoteAPI): Note => {
  const note = {
    id: input.id,
    timestamp: input.timestamp * 1000,
    content: input.content,
  }

  return note
}

export const noteOutputAdapter = (output: Partial<Note>): Partial<NoteAPI> => {
  const note = {
    content: output.content,
  }

  return note
}

export const waiverInputAdapter = (input: WaiverAPI): Waiver => {
  const waiver = {
    id: input.id,
    signedTimestamp: input.signed_timestamp * 1000,
    title: input.waiver_title,
  }

  return waiver
}

export const groupInputAdapter = (input: GroupAPI): Group =>
  ({
    id: input.id,
    info: {
      account: input.account,
      name: input.name,
      updateTimestamp: input.last_update_timestamp,
      contacts: [],

    },
  })

export const contactInputAdapter = (input: PeopleAPI): Contact => {
  const {
    id, account, favourite,
    picture_url, name, names, gender, dob_day, dob_month, dob_year,
    email, emails, address, addresses, phone, phones, others, tags, dates,
    pictures, waivers, activities, notes,
  } = input

  const info: Contact['info'] = {
    avatar: picture_url || crateGravatar(email || ''),
    starred: favourite || false,
    name: name || '',
    names: (names || []).map(o => mapKeys(snake2pascal, o)),
    gender: gender || null as 'Male' | 'Female' | 'Other' | null,
    birthDay: `${dob_year || ''}/${dob_month || ''}/${dob_day || ''}`,
    email: email || '',
    emails: (emails || []).map(o => mapKeys<NameField[keyof NameField]>(snake2pascal, o)),
    address: address || '',
    addresses: (addresses || []).map(o => mapKeys<NameField[keyof NameField]>(snake2pascal, o)),
    phone: phone || '',
    phones: (phones || []).map(o => mapKeys<NameField[keyof NameField]>(snake2pascal, o)),
    dates: (dates || []).map(o => mapKeys<NameField[keyof NameField]>(snake2pascal, o)),
    others: (others || []).map(o => mapKeys<NameField[keyof NameField]>(snake2pascal, o)),
    tags, pictures, waivers,
    activities: activities ? activities.map(activityInputAdapter) : [],
    notes: notes ? notes.map(noteInputAdapter) : [],
  }

  return { id, info }
}
