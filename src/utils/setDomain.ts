export default function setDomain() {
  const originalDomainChunks = document.domain.split('.')
  try {
    while (originalDomainChunks.length > 2 && true) {
      originalDomainChunks.shift()
      document.domain = originalDomainChunks.join('.')
    }
  } catch {
    return
  }
}
