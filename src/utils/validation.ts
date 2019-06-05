const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isEmail = (text: string) => emailReg.test(text)

export const isYear = (year: number) => year > 1900 && year < 2100

export const isMonth = (month: number) => (month > 0) && (month <= 12)

export const isValidDate = (day: number, month: number, year: number) => {
  if (year < 1900 || year > 2100) return false
  if (!isYear(year)) return false
  if (!isMonth(month)) return false

  const isLeap = year % 4 === 0 && year % 400 !== 0

  switch (month) {
    case 2:
      return (day > 0) && (isLeap ? (day <= 29) : (day <= 28))
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return (day > 0) && (day <= 31)
    default:
      return (day > 0) && (day <= 30)
  }
}
