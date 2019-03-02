import isEmbedded from '~src/utils/isEmbedded'
import setDomain from '~src/utils/setDomain'

if (isEmbedded) {
  setDomain()

  const message = `
    message from wf-crm,
    current location is: ${window.location.href}
  `
  window.top.postMessage(message, '*')

  window.addEventListener('message', (event) => {
    if (event.origin !== document.location.origin
      && event.origin !== 'http://localhost:8000') return

    // tslint:disable-next-line:no-console
    console.log('Received message:', event.data)
    // tslint:disable-next-line:no-console
    console.log('Received from:', event.source)
  })
}
