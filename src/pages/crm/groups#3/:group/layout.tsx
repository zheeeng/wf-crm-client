import React, { useEffect } from 'react'
import { ComponentProps } from '@roundation/roundation'
import useGroups from '~src/containers/useGroups'
import useContacts from '~src/containers/useContacts'

const Content: React.FC<{ group: string }> = React.memo(({ group, children }) => {
  useContacts()
  const { groupIdState } = useGroups()

  useEffect(
    () => {
      groupIdState.value && groupIdState.setValue(group)

      return groupIdState.clear
    },
    [group, groupIdState],
  )

  return <>{children}</>
})

export interface Props extends ComponentProps<never, 'search' | 'page'> {
  group: string
}

const GroupsContactLayout: React.FC<Props> = React.memo(
  ({ group, children, queries }) => (
    <useContacts.Provider
      searchTerm={queries.search ? queries.search[0] : ''}
      page={queries.page ? parseInt(queries.page[0]) : undefined}
      groupId={group}
    >
      <Content group={group}>
        {children}
      </Content>
    </useContacts.Provider>
  ),
)

export default GroupsContactLayout
