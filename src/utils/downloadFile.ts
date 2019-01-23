export default function downloadFile (dataURI: string): void {
  const anchor = document.createElement('a')
  anchor.href = dataURI

  anchor.setAttribute('style', 'visibility:hidden')

  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
