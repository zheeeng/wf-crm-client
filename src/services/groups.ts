import { Group } from '~src/types/Contact'
import createStore from '@roundation/store'

const store = createStore(setState => ({
  groups: [] as Group[],
  async fetchGroups () {
    const groupsRes = await fetch('http://localhost:3080/groups')
    setState({
      groups: await groupsRes.json() as Group[],
    })
  },
}))

export default store
