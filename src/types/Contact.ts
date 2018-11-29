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
    gender: 'Male' | 'Female' | '',
    birthDay: string,
    email: string,
    address: string,
    telephone: string,
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
    email, address, phone,
  } = input

  const info = {
    avatar: picture_url || '',
    starred: favourite || false,
    name: name || '',
    gender: gender || '' as 'Male' | 'Female' | '',
    birthDay: `${dob_year || ''}/${dob_month || ''}/${dob_day || ''}`,
    email: email || '',
    address: address || '',
    telephone: phone || '',
  }

  return { id, info }
}

export const outputAdapter = (output: ApiContact): Partial<ApiPeople> => {
  const params = {
    email: output.Email || null,
    phone: output.Phone || null,
    first_name: output['First name'] || null,
    last_name: output['Last name'] || null,
  }

  return params
}
