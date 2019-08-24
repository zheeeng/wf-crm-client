import { isValidDate } from '~src/utils/validation'

export interface FieldSegmentValue { key: string, value: string }

export interface FieldValue {
  values: FieldSegmentValue[]
  appendValues?: FieldSegmentValue[]
  id?: string
  priority: number
  waiver?: any
}

export const joinSegmentFieldValues = (name: string, values: FieldSegmentValue[]) =>  {
  if (name === 'date') {
    const dateField = [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      values.find(v => v.key === 'month')!.value.padStart(2, '0'),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      values.find(v => v.key === 'day')!.value.padStart(2, '0'),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      values.find(v => v.key === 'year')!.value.padStart(4, '0'),
    ].join('/').trim()

    return dateField !== '00/00/0000' ? dateField : ''
  }

  return values
    .filter(value => value.key !== 'title')
    .map(value => value.value)
    .join(' ').trim()
}

export const getLabelExample = (inputType?: string) => {
  switch (inputType) {
    case 'calendar':
      return 'label: e.g. Birthday'
    case 'email':
      return 'label: e.g. Person'
    case 'number':
      return 'label: e.g. Person'
    case 'address':
      return 'label: e.g. Home'
    default:
      return 'label'
  }
}

export const getLowerPriority = (fieldValues: FieldValue[]) =>
  Math.max(Math.min(...fieldValues.map(fv => fv.priority).filter(p => p !== undefined)) - 1, 1)

export const getFieldDefaultTitle = (fieldValue: FieldValue) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  fieldValue.values.find(sv => sv.key === 'title')!.value

export const getFieldDefaultTitleWidthDec = (fieldValue: FieldValue) => {
  const defaultTitle = getFieldDefaultTitle(fieldValue).trim()
  if (defaultTitle) {
    return '• ' + defaultTitle
  }

  return ''
}

export const getFieldDateFromValues = (values: FieldSegmentValue[]) => {
  const year = values.find(v => v.key === 'year')
  const month = values.find(v => v.key === 'month')
  const day = values.find(v => v.key === 'day')
  if (!year || !month || !day) return null
  if (!isValidDate(+day.value, +month.value, +year.value)) return null

  const d = new Date()
  d.setFullYear(+year.value)
  d.setMonth(+month.value - 1)
  d.setDate(+day.value)
  return d
}

export const mapOption2SelectOption = (option: string) => option === ''
  ? ({ value: '', label: 'None' })
  : ({ value: option, label: option })
