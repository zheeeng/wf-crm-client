import './bootstrap'
import ReactDOM from 'react-dom'
import registerServiceWorker from '~src/registerServiceWorker'
import { exchangeAPIKey } from '~src/utils/qs3Login'
import App, { Skeleton } from '~src/App'

const isDev = process.env.NODE_ENV === 'development'
const $mountEl = document.querySelector('#content')

async function main () {
  if (isDev && document.location.pathname === '/') {
    document.location.pathname = '/crm'
  }

  try {
    if (!isDev) await exchangeAPIKey()
  } catch {
    if (document.location.pathname !== '/auth/signin') {
      document.location.pathname = '/auth/signin'
    }
    return
  }

  $mountEl && ReactDOM.render(App(), $mountEl)
}

function side () {
  $mountEl && ReactDOM.render(Skeleton(), $mountEl)
}

navigator.userAgent !== 'ReactSnap' ? main() : side()

registerServiceWorker()
