import * as React from 'react'
import * as Icons from '@material-ui/icons'

const MaterialIcon: React.SFC<{ icon: string }> = ({ icon }) => {
  const Icon = Icons[icon]

  if (!Icon) {
      throw Error(`Could not find @material-ui/icons/${icon}`)
  }

  return React.createElement(Icon)
}

export default MaterialIcon
