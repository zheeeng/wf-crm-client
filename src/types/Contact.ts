import { Arrify } from './utils'

export interface Contact {
  id: string,
  info: {
    avatar: string,
    starred: boolean,
    name: string,
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
