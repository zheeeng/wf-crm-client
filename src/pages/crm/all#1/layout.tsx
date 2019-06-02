import React, { useContext } from 'react'
import { ComponentProps } from '@roundation/roundation'
import ContactsContainer from '~src/containers/Contacts'

const Content: React.FC = React.memo(({ children }) => {
  useContext(ContactsContainer.Context)

  return <>{children}</>
})

export interface Props extends ComponentProps<never, 'search' | 'page'> {}

const AllLayout: React.FC<Props> = React.memo(
  ({ children, queries }) => {
    return (
      <ContactsContainer.Provider
        searchTerm={queries.search ? queries.search[0] : ''}
        page={queries.page ? parseInt(queries.page[0]) : undefined}>
        <Content>
          {children}
        </Content>
      </ContactsContainer.Provider>
    )
  },
)

export default AllLayout
