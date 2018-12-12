import * as React from 'react'
import { ComponentProps } from '@roundation/roundation/lib/types'

export interface Props extends
  ComponentProps<'aside'> {
}

const MyCustomersLayout: React.FC<Props> = ({ slots, children }) => (
  <>
    {slots.aside}
    {children}
  </>
)

export default MyCustomersLayout
