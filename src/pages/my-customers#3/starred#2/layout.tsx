import React, { useEffect, useCallback, useContext } from 'react'
import ContactsContainer from '~src/containers/Contacts'

const Content: React.FC = React.memo(({ children }) => {
  const { fetchContacts, addMutation, starMutation } = useContext(ContactsContainer.Context)

  const refresh = useCallback(() => fetchContacts({ page: 1, size: 30, favourite: true }), [])

  useEffect(() => { refresh() }, [addMutation, starMutation])

  return <>{children}</>
})

const StarredLayout: React.FC = React.memo(
  ({ children }) => (
    <ContactsContainer.Provider>
      <Content>
        {children}
      </Content>
    </ContactsContainer.Provider>
  ),
)

export default StarredLayout
