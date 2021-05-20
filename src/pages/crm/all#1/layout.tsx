import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import { useContacts, UseContactsProvider } from '~src/containers/useContacts'

const Content: React.FC = React.memo(({ children }) => {
  useContacts()

  return <>{children}</>
})

export interface Props
  extends ComponentProps<never, 'search' | 'page' | 'export'> {}

const AllLayout: React.FC<Props> = React.memo(({ children, queries }) => {
  return (
    <UseContactsProvider
      exportAll={queries.export && queries.export[0] === 'all'}
      searchTerm={queries.search ? queries.search[0] : ''}
      page={queries.page ? parseInt(queries.page[0]) : undefined}
    >
      <Content>{children}</Content>
    </UseContactsProvider>
  )
})

export default AllLayout
