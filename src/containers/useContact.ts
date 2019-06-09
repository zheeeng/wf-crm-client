import { useCallback, useEffect, useMemo } from 'react'
import {
  PeopleAPI, contactInputAdapter, Contact,
  contactOutputAdapter,
  CommonField,
  NoteAPI, noteInputAdapter,
  WaiverAPI, waiverInputAdapter,
} from '~src/types/Contact'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import useLatest from '~src/hooks/useLatest'
import { pascal2snake, snake2pascal } from '~src/utils/caseConvert'
import mapKeys from '~src/utils/mapKeys'
import useContactsCount from '~src/containers/useContactsCount'
import useAlert from '~src/containers/useAlert'

const useContact = (contactId: string) => {
  const { refreshCounts } = useContactsCount()
  const {
    data: contactData,
    request: getContact,
    isLoading: isGettingContact,
    error: getContactError,
  } = useGet<PeopleAPI>()
  const { data: updatedContactData, request: putContact, error: putContactError } = usePut<PeopleAPI>()
  const { data: putContactFiledData, request: putContactFiled } = usePut<PeopleAPI>()
  const { request: getFields, error: getFieldsError } = useGet()
  const { request: postField, error: postFieldError } = usePost<CommonField>()
  const { request: putField, error: putFieldError } = usePut<CommonField>()
  const { request: deleteField, error: deleteFieldError } = useDelete()
  const { request: deleteContact, error: deleteContactError } = useDelete()
  const { data: afterAddedTags, request: postTag } = usePost<string[]>()
  const { data: afterRemovedTags, request: deleteTag } = useDelete<string[]>()
  const {
    request: getNotes,
    isLoading: isGettingNotes,
    error: getNotesError,
  } = useGet<NoteAPI[]>()
  const {
    data: waiversData,
    request: getWaivers,
    isLoading: isFetchingWaivers,
    error: getWaiversError,
  } = useGet<WaiverAPI[]>()
  const { request: postSplitWaiver, error: postSplitWaiverError } = usePost<PeopleAPI>()
  const { request: postNote, error: postNoteError } = usePost<NoteAPI>()
  const { request: putNote, error: putNoteError } = usePut<NoteAPI>()
  const { request: deleteNote, error: deleteNoteError } = useDelete()

  const freshContact = useMemo(
    () => contactData ? contactInputAdapter(contactData) : null,
    [contactData],
  )
  const updatedContact = useMemo(
    () => updatedContactData ? contactInputAdapter(updatedContactData) : null,
    [updatedContactData],
  )
  const latestContact = useLatest(freshContact, updatedContact)

  const { fail } = useAlert()

  useEffect(
    () => { postFieldError && fail(postFieldError.message) },
    [postFieldError, fail],
  )
  useEffect(
    () => { putFieldError && fail(putFieldError.message) },
    [putFieldError, fail],
  )
  useEffect(
    () => { putFieldError && fail(putFieldError.message) },
    [putFieldError, fail],
  )

  useEffect(
    () => { postSplitWaiverError && fail(postSplitWaiverError.message) },
    [postSplitWaiverError, fail],
  )

  useEffect(
    () => { deleteContactError && fail(deleteContactError.message) },
    [deleteContactError, fail],
  )

  const tags = useLatest<string[] | undefined | null>(
    latestContact && latestContact.info.tags,
    afterAddedTags,
    afterRemovedTags,
  ) || []

  const gender = useLatest<'Male' | 'Female' | 'Other' | ''>(
    latestContact ? (latestContact.info.gender || '') : '',
    putContactFiledData ? (putContactFiledData.gender || '') : '',
  )

  const contact = useMemo<Contact | undefined>(
    () => latestContact
      ? tags.length
        ? { ...latestContact, info: { ...latestContact.info, tags } }
        : latestContact
      : undefined,
    [latestContact, tags],
  )

  const fetchContact = useCallback(
    async (contactId: string) => {
      await getContact(`/api/people/${contactId}`)({
        embeds: ['all'].join(','),
      })
    },
    [getContact],
  )

  useEffect(
    () => { refreshCounts() },
    [refreshCounts],
  )

  useEffect(
    () => { contactId && fetchContact(contactId) },
    [fetchContact, contactId],
  )

  const updateContact = useCallback(
    async (cont: Contact) => putContact(`/api/people/${contactId}`)(contactOutputAdapter(cont)),
    [contactId, putContact],
  )

  const fetchFields = useCallback(
    async () => getFields(`/api/people/${contactId}/fields`)({}),
    [contactId, getFields],
  )
  const addField = useCallback(
    async (field: CommonField): Promise<CommonField | null> => {
      const result = await postField(`/api/people/${contactId}/fields`)(mapKeys(pascal2snake, field))

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId, postField],
  )
  const updateField = useCallback(
    async (field: CommonField): Promise<CommonField | null> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const result = await putField(`/api/people/${contactId}/fields/${field.id!}`)(mapKeys(pascal2snake, field))

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId, putField],
  )
  const removeField = useCallback(
    async (field: CommonField) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const result = await deleteField(`/api/people/${contactId}/fields/${field.id!}`)(mapKeys(pascal2snake, field))

      return result && (field.id || null)
    },
    [contactId, deleteField],
  )

  const starContact = useCallback(
    async (star: boolean) => {
      await putContact(`/api/people/${contactId}`)({ favourite: star })

      refreshCounts()
    },
    [contactId, putContact, refreshCounts],
  )

  const updateContactGender = useCallback(
    async (newGender: 'Male' | 'Female' | 'Other') => {
      await putContactFiled(`/api/people/${contactId}`)({ gender: newGender })
    },
    [contactId, putContactFiled],
  )

  const removeContact = useCallback(
    async () => {
      await deleteContact(`/api/people/${contactId}`)()
      refreshCounts()
    },
    [contactId, deleteContact, refreshCounts],
  )

  const addTag = useCallback(
    async (tag: string) => postTag(`/api/people/${contactId}/tags`)({ tag }),
    [contactId, postTag],
  )

  const removeTag = useCallback(
    async (tag: string) => deleteTag(`/api/people/${contactId}/tags/${tag}`)(),
    [contactId, deleteTag],
  )

  const fetchNotes = useCallback(
    async () => getNotes(`/api/people/${contactId}/notes`)({})
      .then(notes => (notes || []).map(noteInputAdapter)),
    [contactId, getNotes],
  )

  const addNote = useCallback(
    async (content: string): Promise<NoteAPI | null> => {
      const result = await postNote(`/api/people/${contactId}/notes`)({ note: content })
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then(n => noteInputAdapter(n!))

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId, postNote],
  )

  const fetchWaivers = useCallback(
    async () => getWaivers(`/api/people/${contactId}/waivers`)({}),
    [contactId, getWaivers],
  )

  const waivers = useMemo(
    () => (waiversData || []).map(waiverInputAdapter).sort((p, c) => c.signedTimestamp - p.signedTimestamp),
    [waiversData],
  )

  const splitWaiver = useCallback(
    async (waiverId: string): Promise<PeopleAPI | null> => {
      const result = await postSplitWaiver(`/api/people/${contactId}/splitWaiver/${waiverId}`)()

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId, postSplitWaiver],
  )

  const updateNote = useCallback(
    async (id: string, content: string): Promise<NoteAPI | null> => {
      const result = await putNote(`/api/people/${contactId}/notes/${id}`)({ note: content })
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then(n => noteInputAdapter(n!))

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId, putNote],
  )

  const removeNote = useCallback(
    async (id: string) =>
      deleteNote(`/api/people/${contactId}/notes/${id}`)(),
    [contactId, deleteNote],
  )

  return {
    contact,
    fetchContact, isFetchingContact: isGettingContact, fetchContactError: getContactError,
    updateContact, updateContactError: putContactError,
    fetchFields, fetchFieldsError: getFieldsError,
    addField, addFieldError: postFieldError,
    updateField, updateFieldError: putFieldError,
    removeField, removeFieldError: deleteFieldError,
    starContact,
    updateContactGender,
    removeContact, removeContactError: deleteContactError,
    tags, addTag, removeTag,
    gender,
    fetchNotes, isFetchingNotes: isGettingNotes, fetchNotesError: getNotesError,
    waivers, fetchWaivers, isFetchingWaivers, fetchWaiversError: getWaiversError,
    splitWaiver, splitWaiverError: postSplitWaiverError,
    addNote, addNoteError: postNoteError,
    updateNote, updateNoteError: putNoteError,
    removeNote, removeNoteError: deleteNoteError,
  }
}

export default useContact
