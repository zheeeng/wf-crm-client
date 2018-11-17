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
  // favourite: boolean
  account: string
  name: string | null
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

export const inputAdapter = (input: ApiPeople): Contact => {
  const {
    id,
    account, name, gender, dob_day, dob_month, dob_year,
    email, address, phone,
  } = input

  const info = {
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    starred: false,
    name: name || '',
    gender: gender || '' as 'Male' | 'Female' | '',
    birthDay: `${dob_year || ''}/${dob_month || ''}/${dob_day || ''}`,
    email: email || 'hi@zheeeng.me',
    address: address || '330 Wyn Ave se Seattle, WA, 98121',
    telephone: phone || '(212)323-9323',
  }

  return { id, info }
}
