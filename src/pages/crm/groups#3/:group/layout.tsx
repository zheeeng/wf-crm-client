import React, { useEffect, useContext } from 'react'
import { ComponentProps } from '@roundation/roundation'
import GroupsContainer from '~src/containers/Groups'
import ContactsContainer from '~src/containers/Contacts'
import ContactsCountContainer from '~src/containers/ContactsCount'

const Content: React.FC<{ group: string }> = React.memo(({ group, children }) => {
  const { fetchContacts, addMutation, starMutation, removeMutation, mergeContactsMutation, removeContactsFromGroupMutation } = useContext(ContactsContainer.Context)
  const { refreshPageMutation } = useContext(ContactsCountContainer.Context)
  const { setGroupId } = useContext(GroupsContainer.Context)

  useEffect(
    () => { fetchContacts(30) },
    [addMutation, starMutation, removeMutation, group, refreshPageMutation, mergeContactsMutation, removeContactsFromGroupMutation],
  )

  useEffect(
    () => {
      setGroupId(group)

      return () => setGroupId('')
    },
    [group],
  )

  return <>{children}</>
})

export interface Props extends ComponentProps<never, 'search' | 'page'> {
  group: string
}

const GroupsContactLayout: React.FC<Props> = React.memo(
  ({ group, children, queries }) => (
    <ContactsContainer.Provider
      searchTerm={queries.search ? queries.search[0] : ''}
      page={queries.page ? parseInt(queries.page[0]) : undefined}
      groupId={group}
    >
      <Content group={group}>
        {children}
      </Content>
    </ContactsContainer.Provider>
  ),
)

export default GroupsContactLayout
