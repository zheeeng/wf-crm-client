import React from 'react'

import { ComponentProps } from '@roundation/roundation/lib/types'

export interface Props extends ComponentProps {
  children: React.ReactElement<any>
}

const GroupsContactLayout: React.FC<Props> = React.memo(({ children }) => children)

export default GroupsContactLayout
