import { Arrify } from './utils'

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

export interface Contact {
  id: string,
  info: {
    avatar: string,
    starred: boolean,
    name: string,
    gender: 'Male' | 'Female' | null,
    birthDay: string,
    email: string,
    address: string,
    telephone: string,
    tags: string[],
    pictures: string[],
    waivers: any[],
    activities: Activity[],
    notes: Note[],
  }
}

export interface ContactFullInfo extends Arrify<{
  id: Contact['id'],
  info: Arrify<Contact['info']>,
}> {
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
  picture_url: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  gender: 'Male' | 'Female' | null
  dob_day: string | null
  dob_month: string | null
  dob_year: string | null
  email: string | null
  address: string | null
  phone: string | null
  tags: string[]
  pictures: string[],
  waivers: any[],
  activities: ActivityAPI[] | null,
  notes: NoteAPI[] | null,
}

export interface ContactAPI {
  'First name': string
  'Last name': string
  'Email': string
  'Phone': string
}

export const contactOutputAdapter = (output: Contact): Partial<PeopleAPI> => {
  const params = {
    email: output.info.email,
    phone: output.info.telephone,
    favourite: output.info.starred,
    picture_url: output.info.avatar,
    name: output.info.name,
    gender: output.info.gender || null,
    address: output.info.address,
  }

  for (const p in params) {
    if (!params.hasOwnProperty(p)) continue

    if (!params[p] || (Array.isArray(params[p]) && params[p].length === 0)) {
      delete params[p]
    }
  }

  return params
}

export const contactFieldAdapter = (field: ContactAPI): Partial<PeopleAPI> => {
  const params = {
    email: field.Email || null,
    phone: field.Phone || null,
    first_name: field['First name'] || null,
    last_name: field['Last name'] || null,
  }

  return params
}

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
  const activity = {
    id: input.id,
    timestamp: input.timestamp,
    content: input.content,
  }

  return activity
}

export const noteOutputAdapter = (output: Partial<Note>): Partial<NoteAPI> => {
  const note = {
    content: output.content,
  }

  return note
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
    picture_url, name, gender, dob_day, dob_month, dob_year,
    email, address, phone, tags,
    pictures, waivers, activities, notes,
  } = input

  const info: Contact['info'] = {
    avatar: picture_url || '',
    starred: favourite || false,
    name: name || '',
    gender: gender || null as 'Male' | 'Female' | null,
    birthDay: `${dob_year || ''}/${dob_month || ''}/${dob_day || ''}`,
    email: email || '',
    address: address || '',
    telephone: phone || '',
    tags, pictures, waivers,
    activities: activities ? activities.map(activityInputAdapter) : [],
    notes: notes ? notes.map(noteInputAdapter) : [],
  }

  return { id, info }
}
