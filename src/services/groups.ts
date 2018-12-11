import { Group, PeopleAPI, contactInputAdapter, groupInputAdapter, GroupAPI } from '~src/types/Contact'
import createStore from '@roundation/store'
import fetch from '~src/utils/fetch'

const store = createStore(setState => ({
  groups: [] as Group[],
  async fetchGroups () {
    try {
      const groups = await fetch<GroupAPI[]>('/api/group')
      setState({
        groups: groups.map(groupInputAdapter),
      })
    } catch {}
  },
  async fetchGroupContacts (groupId: string) {
    try {
      const contactsRes = await fetch<PeopleAPI[]>('/api/group')
      if (contactsRes.length === 0) return
      setState(state => ({
        groups: state.groups.map(group => group.id === groupId
          ? ({
            ...group,
            contacts: contactsRes.map(contactInputAdapter),
          })
          : group,
        ),
      }))
    } catch {}
  },
}))

export default store
