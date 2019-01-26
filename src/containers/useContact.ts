import { useState, useCallback, useContext, useMemo } from 'react'
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
  const { data: freshContactData, request: getContact } = useGet<PeopleAPI>()
  const { data: updatedContactData, request: putContact, error: putContactError } = usePut()
  const { request: getFields, error: getFieldsError } = useGet()
  const { request: postField, error: postFieldError } = usePost<CommonField>()
  const { request: putField, error: putFieldError } = usePut<CommonField>()
  const { request: deleteField, error: deleteFieldError } = useDelete()
  const { request: deleteContact, error: deleteContactError } = useDelete()
  const { data: afterAddedTags, request: postTag } = usePost<string[]>()
  const { data: afterRemovedTags, request: deleteTag } = useDelete<string[]>()
  const { request: getNotes, error: getNotesError } = useGet<NoteAPI[]>()
  const { data: waiversData, request: getWaivers, error: getWaiversError } = useGet<WaiverAPI[]>()
  const { request: postSplitWaiver, error: postSplitWaiverError } = usePost<PeopleAPI>()
  const { request: postNote, error: postNoteError } = usePost<NoteAPI>()
  const { request: putNote, error: putNoteError } = usePut<NoteAPI>()
  const { request: deleteNote, error: deleteNoteError } = useDelete()

  const freshContact = useDepMemo(convertContact, [freshContactData])
  const updatedContact = useDepMemo(convertContact, [updatedContactData])
  const latestContact = useLatest(freshContact, updatedContact)

  const tags = useLatest<string[] | undefined | null>(
    latestContact && latestContact.info.tags,
    afterAddedTags,
    afterRemovedTags,
  ) || []

  const gender = useMemo(
    () => latestContact && latestContact.info.gender,
    [latestContact],
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

      return mapKeys(snake2pascal, result!)
    },
    [contactId],
  )
  const updateField = useCallback(
    async (field: CommonField): Promise<CommonField | null> => {
      const result = await putField(`/api/people/${contactId}/fields/${field.id!}`)(mapKeys(pascal2snake, field))

      return mapKeys(snake2pascal, result!)
    },
    [contactId],
  )
  const removeField = useCallback(
    async (field: CommonField) =>
      deleteField(`/api/people/${contactId}/fields/${field.id!}`)(mapKeys(pascal2snake, field)),
    [contactId],
  )

  const [starContact, starMutation] = useInfoCallback(
    async (star: boolean) => {
      await putContact(`/api/people/${contactId}`)({ favourite: star })
      refreshCounts()
    },
    [contactId],
  )

  const [updateContactGender, updateContactGenderMutation] = useInfoCallback(
    async (newGender: 'Male' | 'Female') => {
      await putContact(`/api/people/${contactId}`)({ gender: newGender })
    },
    [contactId],
  )

  const [removeContact, removeMutation] = useInfoCallback(
    async () => {
      await deleteContact(`/api/people/${contactId}`)()
      refreshCounts()
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
        .then(n => noteInputAdapter(n!))

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

      return mapKeys(snake2pascal, result!)
    },
    [contactId],
  )

  const [ toSplitWaiver, setToSplitWaiver ] = useState({
    id: '',
    title: '',
  })

  const readyToSplitWaiver = useCallback(
    (id: string, title: string) => setToSplitWaiver({ id, title }),
    [],
  )

  const cancelSplitWaiver = useCallback(
    () => setToSplitWaiver({ id: '', title: '' }),
    [],
  )

  const updateNote = useCallback(
    async (id: string, content: string): Promise<NoteAPI | null> => {
      const result = await putNote(`/api/people/${contactId}/notes/${id}`)({ note: content })
        .then(n => noteInputAdapter(n!))

      return mapKeys(snake2pascal, result!)
    },
    [contactId],
  )

  const removeNote = useCallback(
    async (id: string) =>
      deleteNote(`/api/people/${contactId}/notes/${id}`)(),
    [contactId],
  )

  return {
    contact,
    fetchContact,
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
    fetchNotes, fetchNotesError: getNotesError,
    waivers, fetchWaivers, fetchWaiversError: getWaiversError,
    toSplitWaiver, readyToSplitWaiver, cancelSplitWaiver,
    splitWaiver, splitWaiverError: postSplitWaiverError,
    addNote, addNoteError: postNoteError,
    updateNote, updateNoteError: putNoteError,
    removeNote, removeNoteError: deleteNoteError,
  }
}

export default useContact
