import createStore from '@roundation/store'
import fetch from '~src/utils/fetch'

const store = createStore(setState => ({
  isLogging: false,
  authored: false,
  username: '',
  email: '',
  drawerExpanded: false,
  async auth () {
    setState({
      isLogging: true,
    })
    try {
      await fetch('/api/auth/invalidateToken', {
        method: 'POST',
      })

      setState({
        authored: true,
      })
    } catch {
    } finally {
      setState({
        isLogging: false,
      })
    }
  },
  async login (email: string, password: string) {
    const { username } = await fetch<{ username: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })

    setState({
      authored: true,
      username,
      email,
    })
  },
  async logout () {
    await fetch('/api/auth/logout')
    setState({
      authored: false,
      username: '',
      email: '',
    })
  },
  toggleDrawerExpanded (expanded?: boolean) {
    setState(state => ({ drawerExpanded: expanded === undefined ? !state.drawerExpanded : expanded }))
  },
}))

export default store
