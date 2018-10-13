import { Contact } from '~src/types/Contact'
import createStore from '@roundation/store'

const store = createStore(setState => ({
  contacts: [] as Contact[],
  async fetchContacts () {
    const contactsRes = await fetch('http://localhost:3080/contacts')
    setState({
      contacts: await contactsRes.json() as Contact[],
    })
  },
}))

export default store
