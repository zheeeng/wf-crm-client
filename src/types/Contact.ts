import { Arrify } from './utils'

export interface Activity {
  id: string,
  time: string,
  content: string,
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
    name: string,
    contacts: Contact[],
  }
}

export interface ApiPeople {
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
}

export interface ApiContact {
  'First name': string
  'Last name': string
  'Email': string
  'Phone': string
}

export const inputAdapter = (input: ApiPeople): Contact => {
  const {
    id, account, favourite,
    picture_url, name, gender, dob_day, dob_month, dob_year,
    email, address, phone, tags,
  } = input

  const info = {
    avatar: picture_url || '',
    starred: favourite || false,
    name: name || '',
    gender: gender || null as 'Male' | 'Female' | null,
    birthDay: `${dob_year || ''}/${dob_month || ''}/${dob_day || ''}`,
    email: email || '',
    address: address || '',
    telephone: phone || '',
    tags,
  }

  return { id, info }
}

export const outputAdapter = (output: Contact): Partial<ApiPeople> => {
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

export const fieldAdapter = (field: ApiContact): Partial<ApiPeople> => {
  const params = {
    email: field.Email || null,
    phone: field.Phone || null,
    first_name: field['First name'] || null,
    last_name: field['Last name'] || null,
  }

  return params
}
