import createContainer from 'constate'
import useToggle from '~src/hooks/useToggle'

const App = createContainer(() => {
  const {
    value: drawerExpanded,
    toggle: toggleDrawerExpanded,
    toggleOn: toggleOnDrawerExpanded,
    toggleOff: toggleOffDrawerExpanded,
  } = useToggle(false)

  return {
    drawerExpanded,
    toggleDrawerExpanded,
    toggleOnDrawerExpanded,
    toggleOffDrawerExpanded,
  }
})

export default App
