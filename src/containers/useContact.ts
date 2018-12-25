import { useCallback, useContext, useMemo, useEffect } from 'react'
import { PeopleAPI, contactInputAdapter, Contact, CommonField,
  contactOutputAdapter } from '~src/types/Contact'
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
import { pascal2snake } from '~src/utils/caseConvert'
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
  const { data: updatedContactData, request: putContact } = usePut()
  const { data: contactFields, request: getContactFields } = useGet()
  const { request: postContactField } = usePost<CommonField>()
  const { request: putContactField } = usePut<CommonField>()
  const { request: deleteContactField } = useDelete()
  const { request: deleteContact } = useDelete()
  const { data: afterAddedTags, request: postTag } = usePost<string[]>()
  const { data: afterRemovedTags, request: deleteTag } = useDelete<string[]>()

  const freshContact = useDepMemo(convertContact, [freshContactData])
  const updatedContact = useDepMemo(convertContact, [updatedContactData])
  const latestContact = useLatest(freshContact, updatedContact)

  const tags = useLatest<string[] | undefined | null>(
    latestContact && latestContact.info.tags,
    afterAddedTags,
    afterRemovedTags,
  ) || []

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
      await getContact(`/api/people/${contactId}`)({
        embeds: ['all'].join(','),
      })
    },
    [],
  )

  useEffect(() => { fetchContact() }, [contactId])

  const updateContact = useCallback(
    async (cont: Contact)  => putContact(`/api/people/${contactId}`)(contactOutputAdapter(cont)),
    [],
  )
  const fetchContactFields = useCallback(
    async () => getContactFields(`/api/people/${contactId}/fields`)({}),
    [],
  )
  const addContactField = useCallback(
    async (field: CommonField): Promise<CommonField | null> =>
      postContactField(`/api/people/${contactId}/fields`)(mapKeys(pascal2snake, field)),
    [],
  )
  const updateContactField = useCallback(
    async (field: CommonField): Promise<CommonField | null>  =>
      putContactField(`/api/people/${contactId}/fields/${field.id || ''}`)(mapKeys(pascal2snake, field)),
    [],
  )
  const removeContactField = useCallback(
    async (fieldId: string)  => deleteContactField(`/api/people/${contactId}/fields/${fieldId}`)(),
    [],
  )

  const [starContact, starMutation] = useInfoCallback(
    async (star: boolean) => {
      await putContact(`/api/people/${contactId}`)({ favourite: star })
      refreshCounts()
    },
    [],
  )

  const [removeContact, removeMutation] = useInfoCallback(
    async () => {
      await deleteContact(`/api/people/${contactId}`)()
      refreshCounts()
    },
    [],
  )

  const addTag = useCallback(
    async (tag: string) => postTag(`/api/people/${contactId}/tags`)({ tag }),
    [],
  )

  const removeTag = useCallback(
    async (tag: string) => deleteTag(`/api/people/${contactId}/tags/${tag}`)(),
    [],
  )

  return {
    contact,
    fetchContact,
    updateContact,
    fetchContactFields,
    addContactField, updateContactField, removeContactField,
    starContact, starMutation,
    removeContact, removeMutation,
    tags, addTag, removeTag,
  }
}

export default useContact
