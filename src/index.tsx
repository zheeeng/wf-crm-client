import './bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from '~src/registerServiceWorker'
import App from '~src/App'

const isDev = process.env.NODE_ENV === 'development'
const $mountEl = document.querySelector('#content')

$mountEl && ReactDOM.render(<App isDev={isDev} />, $mountEl)

registerServiceWorker()
