import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from '@roundation/roundation'

import Notification from '~src/components/Notification'
import InjectIntoGlobalStyles from '~src/components/InjectIntoGlobalStyles'
import GlobalThemeProvider from '~src/theme/GlobalThemeProvider'
import useSideDrawer from '~src/containers/useSideDrawer'
import useNotification from '~src/containers/useNotification'
import useAlert from '~src/containers/useAlert'
import useAccount from '~src/containers/useAccount'
import SkeletonApp from '~src/SkeletonApp'

const App = () => (
  <GlobalThemeProvider>
    <CssBaseline />
    <InjectIntoGlobalStyles />
    <useSideDrawer.Provider>
      <useAccount.Provider>
        <useNotification.Provider>
          <useAlert.Provider>
            <Notification />
            <Roundation />
          </useAlert.Provider>
        </useNotification.Provider>
      </useAccount.Provider>
    </useSideDrawer.Provider>
  </GlobalThemeProvider>
)

export const Skeleton = () => (
  <GlobalThemeProvider>
    <CssBaseline />
    <InjectIntoGlobalStyles />
    <useSideDrawer.Provider>
      <SkeletonApp />
    </useSideDrawer.Provider>
  </GlobalThemeProvider>
)

export default App
