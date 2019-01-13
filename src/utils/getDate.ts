const monthTable = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function getDate (time: number): string {
  const t = new Date(time)
  const month = monthTable[t.getMonth()]
  const date = t.getDate()
  const year = t.getFullYear()

  return `${month} ${date}, ${year}`
}

export function getTime (time: number): string {
  const t = new Date(time)

  return t.toLocaleString(
    'en-US',
    { hour: 'numeric', minute: 'numeric', hour12: true },
  )
}

export default getDate
