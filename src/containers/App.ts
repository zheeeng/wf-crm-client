import createContainer from 'constate'
import { useBoolean } from 'react-hanger'

const AppContainer = createContainer(() => {
  const {
    value: drawerExpanded,
    toggle: toggleDrawerExpanded,
    setTrue: toggleOnDrawerExpanded,
    setFalse: toggleOffDrawerExpanded,
  } = useBoolean(false)

  return {
    drawerExpanded,
    toggleDrawerExpanded,
    toggleOnDrawerExpanded,
    toggleOffDrawerExpanded,
  }
})

export default AppContainer
