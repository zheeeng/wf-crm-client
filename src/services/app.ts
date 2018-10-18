import createStore from '@roundation/store'

const store = createStore(setState => ({
  auth: true,
  drawerExpanded: false,
  login () {
    setState({
      auth: true,
    })
  },
  logout () {
    setState({
      auth: false,
    })
  },
  toggleDrawerExpanded (expanded?: boolean) {
    setState(state => ({ drawerExpanded: expanded === undefined ? !state.drawerExpanded : expanded }))
  },
}))

export default store
