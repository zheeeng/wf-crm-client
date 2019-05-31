import React, { useEffect, useContext } from 'react'
import { ComponentProps } from '@roundation/roundation'
import ContactsContainer from '~src/containers/Contacts'
import ContactsCountContainer from '~src/containers/ContactsCount'

const Content: React.FC = React.memo(({ children }) => {
  const { fetchContacts, addMutation, starMutation, removeMutation, mergeContactsMutation, removeContactsFromGroupMutation } = useContext(ContactsContainer.Context)
  const { refreshPageMutation } = useContext(ContactsCountContainer.Context)

  useEffect(
    () => { fetchContacts(30) },
    [addMutation, starMutation, removeMutation, refreshPageMutation, mergeContactsMutation, removeContactsFromGroupMutation],
  )

  return <>{children}</>
})

export interface Props extends ComponentProps<never, 'search' | 'page'> {}

const StarredLayout: React.FC<Props> = React.memo(
  ({ children, queries }) => (
    <ContactsContainer.Provider
      searchTerm={queries.search ? queries.search[0] : ''}
      page={queries.page ? parseInt(queries.page[0]) : undefined}
      favourite
    >
      <Content>
        {children}
      </Content>
    </ContactsContainer.Provider>
  ),
)

export default StarredLayout
