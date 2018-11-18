import { Contact, Activity, ApiPeople, inputAdapter } from '~src/types/Contact'
import createStore from '@roundation/store'
import fetch from '~src/utils/fetch'

const store = createStore(setState => ({
  contact: undefined as Contact | undefined,
  activities: [] as Activity[],
  async fetchContact (id: string) {
    const result = await fetch<ApiPeople>(`/api/people/${id}`)
    setState({
      contact: inputAdapter(result),
    })
  },
  async fetchContactActivities (id: string) {
    const result = await fetch<Activity[]>(`/api/people/${id}/activities`)
    setState({
      activities: result,
    })
  },
}))

export default store
