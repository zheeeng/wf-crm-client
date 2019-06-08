import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import useContacts from '~src/containers/useContacts'

const Content: React.FC = React.memo(({ children }) => {
  useContacts()

  return <>{children}</>
})

export interface Props extends ComponentProps<never, 'search' | 'page'> {}

const StarredLayout: React.FC<Props> = React.memo(
  ({ children, queries }) => (
    <useContacts.Provider
      searchTerm={queries.search ? queries.search[0] : ''}
      page={queries.page ? parseInt(queries.page[0]) : undefined}
      favourite
    >
      <Content>
        {children}
      </Content>
    </useContacts.Provider>
  ),
)

export default StarredLayout
