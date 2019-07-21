import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from '~src/registerServiceWorker'
import App from '~src/App'

const isDev = process.env.NODE_ENV === 'development'
const $mountEl = document.querySelector('#content')

$mountEl && ReactDOM.render(
  <App isDev={isDev} />,
  $mountEl,
  () => {
    Array.from(document.querySelectorAll('[data-jss-snap]')).forEach(
      elem => elem && elem.parentNode && elem.parentNode.removeChild(elem)
    )
    Array.from(document.querySelectorAll('[data-portal-snap]')).forEach(
      elem => elem && elem.parentNode && elem.parentNode.removeChild(elem)
    )
  },
)

window.snapSaveState = () => {
  Array.from(document.querySelectorAll('[data-jss]')).forEach(elem => elem.setAttribute('data-jss-snap', ''))
  Array.from(document.querySelectorAll('[data-portal]')).forEach(elem => elem.setAttribute('data-portal-snap', ''))
}

registerServiceWorker()
