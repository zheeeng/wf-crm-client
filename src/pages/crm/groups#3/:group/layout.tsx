import React, { useEffect, useCallback, useContext } from 'react'
import GroupsContainer from '~src/containers/Groups'
import ContactsContainer from '~src/containers/Contacts'
import ContactsCountContainer from '~src/containers/ContactsCount'

export interface Props {
  group: string
}

const Content: React.FC<Props> = React.memo(({ group, children }) => {
  const { fetchContacts, addMutation, starMutation, removeMutation } = useContext(ContactsContainer.Context)
  const { refreshPageMutation } = useContext(ContactsCountContainer.Context)
  const { setGroupId } = useContext(GroupsContainer.Context)

  const refresh = useCallback(
    () => fetchContacts({ page: 1, size: 30, groupId: group }),
    [group],
  )

  useEffect(
    () => { refresh() },
    [addMutation, starMutation, removeMutation, group, refreshPageMutation],
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

const GroupsContactLayout: React.FC<Props> = React.memo(
  ({ group, children }) => (
    <ContactsContainer.Provider>
      <Content group={group}>
        {children}
      </Content>
    </ContactsContainer.Provider>
  ),
)

export default GroupsContactLayout
