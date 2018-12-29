import React, { useEffect, useCallback, useContext } from 'react'
import ContactsContainer from '~src/containers/Contacts'

export interface Props {
  group: string
}

const Content: React.FC<Props> = React.memo(({ group, children }) => {
  const { fetchContacts, addMutation, starMutation, removeMutation } = useContext(ContactsContainer.Context)

  const refresh = useCallback(() => fetchContacts({ page: 1, size: 30, groupId: group }), [group])

  useEffect(() => { refresh() }, [addMutation, starMutation, removeMutation, group])

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
