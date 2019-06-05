import { useCallback, useContext, useEffect, useMemo } from 'react'
import {
  PeopleAPI, contactInputAdapter, Contact,
  contactOutputAdapter,
  CommonField,
  NoteAPI, noteInputAdapter,
  WaiverAPI, waiverInputAdapter,
} from '~src/types/Contact'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import useDepMemo from '~src/hooks/useDepMemo'
import useInfoCallback from '~src/hooks/useInfoCallback'
import useLatest from '~src/hooks/useLatest'
import pipe from 'ramda/es/pipe'
import cond from 'ramda/es/cond'
import head from 'ramda/es/head'
import T from 'ramda/es/T'
import isNil from 'ramda/es/isNil'
import ContactsCountContainer from './ContactsCount'
import { pascal2snake, snake2pascal } from '~src/utils/caseConvert'
import mapKeys from '~src/utils/mapKeys'
import AlertContainer from '~src/containers/Alert'

const convertContact = pipe<
Array<PeopleAPI | null>,
PeopleAPI | null,
Contact | undefined
>(
  head,
  cond([
    [isNil, () => undefined],
    [T, contactInputAdapter as any],
  ]),
)

const useContact = (contactId: string) => {
  const { refreshCounts } = useContext(ContactsCountContainer.Context)
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

  const freshContact = useDepMemo(convertContact, [contactData])
  const updatedContact = useDepMemo(convertContact, [updatedContactData])
  const latestContact = useLatest(freshContact, updatedContact)

  const { fail } = useContext(AlertContainer.Context)

  useEffect(
    () => { postFieldError && fail(postFieldError.message) },
    [postFieldError],
  )
  useEffect(
    () => { putFieldError && fail(putFieldError.message) },
    [putFieldError],
  )
  useEffect(
    () => { putFieldError && fail(putFieldError.message) },
    [putFieldError],
  )

  useEffect(
    () => { postSplitWaiverError && fail(postSplitWaiverError.message) },
    [postSplitWaiverError],
  )

  useEffect(
    () => { deleteContactError && fail(deleteContactError.message) },
    [deleteContactError],
  )

  const tags = useLatest<string[] | undefined | null>(
    latestContact && latestContact.info.tags,
    afterAddedTags,
    afterRemovedTags,
  ) || []

  const gender = useLatest<'Male' | 'Female' | 'Other' | ''>(
    latestContact && latestContact.info.gender || '',
    putContactFiledData && putContactFiledData.gender || '',
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
    async () => {
      if (!contactId) return

      await getContact(`/api/people/${contactId}`)({
        embeds: ['all'].join(','),
      })
    },
    [contactId],
  )

  const updateContact = useCallback(
    async (cont: Contact) => putContact(`/api/people/${contactId}`)(contactOutputAdapter(cont)),
    [contactId],
  )

  const fetchFields = useCallback(
    async () => getFields(`/api/people/${contactId}/fields`)({}),
    [contactId],
  )
  const addField = useCallback(
    async (field: CommonField): Promise<CommonField | null> => {
      const result = await postField(`/api/people/${contactId}/fields`)(mapKeys(pascal2snake, field))

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId],
  )
  const updateField = useCallback(
    async (field: CommonField): Promise<CommonField | null> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const result = await putField(`/api/people/${contactId}/fields/${field.id!}`)(mapKeys(pascal2snake, field))

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId],
  )
  const removeField = useCallback(
    async (field: CommonField) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const result = await deleteField(`/api/people/${contactId}/fields/${field.id!}`)(mapKeys(pascal2snake, field))

      return result && (field.id || null)
    },
    [contactId],
  )

  const [starContact, starMutation] = useInfoCallback(
    async (star: boolean) => {
      await putContact(`/api/people/${contactId}`)({ favourite: star })
    },
    [contactId],
  )

  const [updateContactGender, updateContactGenderMutation] = useInfoCallback(
    async (newGender: 'Male' | 'Female' | 'Other') => {
      await putContactFiled(`/api/people/${contactId}`)({ gender: newGender })
    },
    [contactId],
  )

  const [removeContact, removeMutation] = useInfoCallback(
    async () => {
      await deleteContact(`/api/people/${contactId}`)()
    },
    [contactId],
  )

  const addTag = useCallback(
    async (tag: string) => postTag(`/api/people/${contactId}/tags`)({ tag }),
    [contactId],
  )

  const removeTag = useCallback(
    async (tag: string) => deleteTag(`/api/people/${contactId}/tags/${tag}`)(),
    [contactId],
  )

  const fetchNotes = useCallback(
    async () => getNotes(`/api/people/${contactId}/notes`)({})
      .then(notes => (notes || []).map(noteInputAdapter)),
    [contactId],
  )

  const addNote = useCallback(
    async (content: string): Promise<NoteAPI | null> => {
      const result = await postNote(`/api/people/${contactId}/notes`)({ note: content })
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then(n => noteInputAdapter(n!))

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId],
  )

  const fetchWaivers = useCallback(
    async () => getWaivers(`/api/people/${contactId}/waivers`)({}),
    [contactId],
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
    [contactId],
  )

  const updateNote = useCallback(
    async (id: string, content: string): Promise<NoteAPI | null> => {
      const result = await putNote(`/api/people/${contactId}/notes/${id}`)({ note: content })
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .then(n => noteInputAdapter(n!))

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return mapKeys(snake2pascal, result!)
    },
    [contactId],
  )

  const removeNote = useCallback(
    async (id: string) =>
      deleteNote(`/api/people/${contactId}/notes/${id}`)(),
    [contactId],
  )

  useEffect(
    () => { refreshCounts() },
    [starMutation, removeMutation],
  )

  return {
    contact,
    fetchContact, isFetchingContact: isGettingContact, fetchContactError: getContactError,
    updateContact, updateContactError: putContactError,
    fetchFields, fetchFieldsError: getFieldsError,
    addField, addFieldError: postFieldError,
    updateField, updateFieldError: putFieldError,
    removeField, removeFieldError: deleteFieldError,
    starContact, starMutation,
    updateContactGender, updateContactGenderMutation,
    removeContact, removeMutation, removeContactError: deleteContactError,
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
