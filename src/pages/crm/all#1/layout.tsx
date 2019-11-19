import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import useContacts from '~src/containers/useContacts'

const Content: React.FC = React.memo(({ children }) => {
  useContacts()

  return <>{children}</>
})

export interface Props extends ComponentProps<never, 'search' | 'page' | 'export'> {}

const AllLayout: React.FC<Props> = React.memo(
  ({ children, queries }) => {
    return (
      <useContacts.Provider
        exportAll={queries.export && queries.export[0]  === 'all'}
        searchTerm={queries.search ? queries.search[0] : ''}
        page={queries.page ? parseInt(queries.page[0]) : undefined}>
        <Content>
          {children}
        </Content>
      </useContacts.Provider>
    )
  },
)

export default AllLayout
