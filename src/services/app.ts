import createStore from '@roundation/store'
import fetch from '~src/utils/fetch'

const store = createStore(setState => ({
  isLogging: false,
  isLoggingOut: false,
  authored: false,
  username: '',
  email: '',
  drawerExpanded: false,
  async auth () {
    setState({
      isLogging: true,
    })
    try {
      await fetch('/api/auth/authToken', {
        method: 'POST',
      })

      setState({ authored: true })
    } catch {
    } finally {
      setState({ isLogging: false })
    }
  },
  async login (email: string, password: string) {
    setState({
      isLogging: true,
    })
    try {
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
    } catch {
    } finally {
      setState({ isLogging: false })
    }

  },
  async logout () {
    setState({
      isLoggingOut: true,
    })
    try {
      await fetch('/api/auth/invalidateToken', {
        method: 'POST',
      })
    } catch {
      setState({
        authored: false,
        username: '',
        email: '',
      })
    } finally {
      setState({ isLoggingOut: false })
    }
  },
  toggleDrawerExpanded (expanded?: boolean) {
    setState(state => ({ drawerExpanded: expanded === undefined ? !state.drawerExpanded : expanded }))
  },
}))

export default store
