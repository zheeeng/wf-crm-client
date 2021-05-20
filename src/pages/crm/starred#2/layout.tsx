import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import { useContacts, UseContactsProvider } from '~src/containers/useContacts'

const Content: React.FC = React.memo(({ children }) => {
  useContacts()

  return <>{children}</>
})

export interface Props extends ComponentProps<never, 'search' | 'page'> {}

const StarredLayout: React.FC<Props> = React.memo(({ children, queries }) => (
  <UseContactsProvider
    searchTerm={queries.search ? queries.search[0] : ''}
    page={queries.page ? parseInt(queries.page[0]) : undefined}
    favourite
  >
    <Content>{children}</Content>
  </UseContactsProvider>
))

export default StarredLayout
