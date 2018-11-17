import { Contact, ApiPeople, inputAdapter } from '~src/types/Contact'
import createStore from '@roundation/store'
import fetch from '~src/utils/fetch'

const store = createStore(setState => ({
  contact: undefined as Contact | undefined,
  async fetchContact (id: string) {
    const result = await fetch<ApiPeople>(`/api/people/${id}`)
    setState({
      contact: inputAdapter(result),
    })
  },
}))

export default store
