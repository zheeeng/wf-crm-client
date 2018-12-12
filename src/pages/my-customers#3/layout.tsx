import * as React from 'react'
import { ComponentProps } from '@roundation/roundation/lib/types'
import sideStore from '~src/services/side'
import groupsStore from '~src/services/groups'
export interface Props extends
  ComponentProps<'aside'> {
}

const MyCustomersLayout: React.FC<Props> = ({ slots, children }) => (
  <>
    {slots.aside}
    {children}
  </>
)

export default sideStore.inject(
    groupsStore.inject(
      MyCustomersLayout,
    ),
  )
