import * as React from 'react'

const StarredLayout: React.FC<{ children: React.ReactElement<any> }> = React.memo(({ children }) => children)

export default StarredLayout
