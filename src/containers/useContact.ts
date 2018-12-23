import { useCallback, useContext, useMemo, useEffect } from 'react'
import { PeopleAPI, contactInputAdapter, Contact, contactOutputAdapter } from '~src/types/Contact'
import { useGet, usePost, usePut, useDelete } from '~src/hooks/useRequest'
import useDepMemo from '~src/hooks/useDepMemo'
import useInfoCallback from '~src/hooks/useInfoCallback'
import useLatest from '~src/hooks/useLatest'
import pipe from 'ramda/src/pipe'
import cond from 'ramda/src/cond'
import head from 'ramda/src/head'
import isNil from 'ramda/src/isNil'
import T from 'ramda/src/T'
import ContactsCountContainer from './ContactsCount'

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
  const { request: deleteContact } = useDelete()
  const { data: afterAddedTags, request: postTag } = usePost<string[]>()
  const { data: afterRemovedTags, request: deleteTag } = useDelete<string[]>()
  const { request: putFields } = usePut()

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
        embeds: ['pictures', 'waivers', 'activities', 'notes'].join(','),
      })
    },
    [],
  )

  useEffect(() => { fetchContact() }, [contactId])

  const updateContact = useCallback(
    async (cont: Contact)  => {
      await putContact(`/api/people/${contactId}`)(contactOutputAdapter(cont))
    },
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
    async (tag: string) => {
      await postTag(`/api/people/${contactId}/tags`)({ tag })
    },
    [],
  )

  const removeTag = useCallback(
    async (tag: string) => {
      await deleteTag(`/api/people/${contactId}/tags/${tag}`)()
    },
    [],
  )

  const submitField = useCallback(
    async (fields: object) => {
      await putFields(`/api/people/${contactId}/fields/${'test'}`)(fields)
      fetchContact()
    },
    [],
  )

  return {
    contact,
    fetchContact,
    updateContact,
    starContact, starMutation,
    removeContact, removeMutation,
    tags, addTag, removeTag,
    submitField,
  }
}

export default useContact
