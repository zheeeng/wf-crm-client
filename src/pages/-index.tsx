import React from 'react'
import { Redirect } from '@roundation/roundation'

const Index: React.FC = React.memo(() => {
  return <Redirect to="./all" noThrow />
})

export default Index
