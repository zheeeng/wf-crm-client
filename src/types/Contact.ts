import { Arrify } from './utils'

export interface Contact {
  id: string,
  info: {
    avatar: string,
    starred: boolean,
    name: string,
    gender: string,
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
