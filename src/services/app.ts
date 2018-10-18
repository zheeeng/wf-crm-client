import createStore from '@roundation/store'

const store = createStore(setState => ({
  drawerExpanded: false,
  toggleDrawerExpanded (expanded?: boolean) {
    setState(state => ({ drawerExpanded: expanded === undefined ? !state.drawerExpanded : expanded }))
  },
}))

export default store
