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
const abbrMonthTable = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function getDate(time: number): string {
  const t = new Date(time)
  const month = monthTable[t.getMonth()]
  const date = t.getDate()
  const year = t.getFullYear()

  return `${month} ${date}, ${year}`
}

export function getTime(time: number): string {
  const t = new Date(time)

  return t
    .toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
    .toLowerCase()
}

export default getDate

export function getDateAndTime(time: number): string {
  const t = new Date(time)
  const month = abbrMonthTable[t.getMonth()]
  const date = t.getDate()
  const year = t.getFullYear()
  const formattedTime = t
    .toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
    .toLowerCase()

  return `${month} ${date}, ${year}, ${formattedTime}`
}

export function getPlaceholderDate(time: Date = new Date()): string {
  const month = (time.getMonth() + 1).toString()
  const date = time.getDate().toString()
  const year = time.getFullYear().toString()

  return `${month.padStart(2, '0')}/${date.padStart(2, '0')}/${year}`
}
