import { Contact, Activity, PeopleAPI, contactInputAdapter, contactOutputAdapter } from '~src/types/Contact'
import createStore from '@roundation/store'
import fetch from '~src/utils/fetch'

const store = createStore(setState => ({
  contact: undefined as Contact | undefined,
  // activities: [] as Activity[],
  async fetchContact (id: string) {
    const result = await fetch<PeopleAPI>(
      `/api/people/${id}?embeds=${encodeURIComponent(
        ['pictures', 'waivers', 'activities', 'notes'].join(','),
      )}`,
    )
    setState({
      contact: contactInputAdapter(result),
    })
  },
  // async fetchContactActivities (id: string) {
  //   const result = await fetch<Activity[]>(`/api/people/${id}/activities`)
  //   setState({
  //     activities: result,
  //   })
  // },
  async updateContact (id: string, contact: Contact) {
    const result = await fetch<PeopleAPI>(`/api/people/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactOutputAdapter(contact)),
    })
    setState({
      contact: contactInputAdapter(result),
    })
  },
  async starContact (id: string, star: boolean) {
    const result = await fetch<PeopleAPI>(`/api/people/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ favourite: star }),
    })
    setState({
      contact: contactInputAdapter(result),
    })
  },
  async addTag (id: string, tag: string) {
    const tags = await fetch<string[]>(`/api/people/${id}/tags`, {
      method: 'POST',
      body:  JSON.stringify({ tag }),
    })
    setState(state => (state.contact && state.contact.id === id)
        ? ({
            // TODO:: update tags field
            contact: {
              ...state.contact,
              info: ({
                ...state.contact.info,
                tags,
              }),
            },
        })
        : state,
      )
  },
  async deleteTag (id: string, tag: string) {
    const tags = await fetch<string[]>(`/api/people/${id}/tags/${tag}`, {
      method: 'DELETE',
    })
    setState(state => (state.contact && state.contact.id === id)
        ? ({
            // TODO:: update tags field
            contact: {
              ...state.contact,
              info: ({
                ...state.contact.info,
                tags,
              }),
            },
        })
        : state,
      )
  },
}))

export default store
