import React, { useEffect, useCallback, useContext } from 'react'
import ContactsContainer from '~src/containers/Contacts'
import ContactsCountContainer from '~src/containers/ContactsCount'

const Content: React.FC = React.memo(({ children }) => {
  const { fetchContacts, addMutation, starMutation, removeMutation } = useContext(ContactsContainer.Context)
  const { refreshPageMutation } = useContext(ContactsCountContainer.Context)

  const refresh = useCallback(() => fetchContacts({ page: 1, size: 30 }), [])

  useEffect(() => { refresh() }, [addMutation, starMutation, removeMutation, refreshPageMutation])

  return <>{children}</>
})

const AllLayout: React.FC = React.memo(
  ({ children }) => (
    <ContactsContainer.Provider>
      <Content>
        {children}
      </Content>
    </ContactsContainer.Provider>
  ),
)

export default AllLayout
