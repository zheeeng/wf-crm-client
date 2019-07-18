import React from 'react'
import { ComponentProps } from '@roundation/roundation'
import useGAPageView from '~src/hooks/useGAPageView'

export interface Props extends ComponentProps {}

const contactsInAllPageReg = /^\/crm\/all\/(\w+)/
const contactsInStarredPageReg = /^\/crm\/starred\/(\w+)/
const contactsInGroupPageReg = /^\/crm\/groups\/\w+\/(\w+)/
const pathReducer = (path: string) => path
  .replace(contactsInAllPageReg, (_, $1) => '/crm/contacts/' + $1)
  .replace(contactsInStarredPageReg, (_, $1) => '/crm/contacts/' + $1)
  .replace(contactsInGroupPageReg, (_, $1) => '/crm/contacts/' + $1)

const AppLayout: React.FC<Props> = ({ children, location }) => {
  const pathname = location ? location.pathname : ''

  useGAPageView(pathReducer, pathname)

  return <>{children}</>
}

export default AppLayout
