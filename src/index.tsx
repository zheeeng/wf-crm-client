import * as React from 'react'
import * as ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Roundation from 'roundation'
import registerServiceWorker from '~src/registerServiceWorker'

ReactDOM.render(
  <CssBaseline>
    <Roundation />
  </CssBaseline>,
  document.getElementById('root') as HTMLElement,
)
registerServiceWorker()
