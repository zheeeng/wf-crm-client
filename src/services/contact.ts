import { Contact } from '~src/types/Contact'
import createStore from '@roundation/store'

const store = createStore(setState => ({
  contact: undefined as Contact | undefined,
  async fetchContact (id: string) {
    const contactRes = await fetch(`http://localhost:3080/contacts/${id}`)
    setState({
      contact: await contactRes.json() as Contact,
    })
  },
}))

export default store
