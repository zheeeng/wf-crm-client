import TimeUnit from '~src/utils/TimeUnit'

export const localStorageKeyForDeletingContacts = 'DeleteContactList'
export const localStorageExpirationForDeletingContacts = TimeUnit.Minute * 30
export function delContactRecordKey(contactId: string) {
  return `del:${contactId}`
}
export function delContactRecordPattern() {
  return /^del:/
}
