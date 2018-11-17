import * as React from 'react'
import { SvgIconProps } from '@material-ui/core/SvgIcon'
import * as Icons from '@material-ui/icons'

export interface Props extends SvgIconProps {
  icon: string
}

const MaterialIcon: React.FC<Props> = ({ icon, ...props }) => {
  const Icon = Icons[icon]

  if (!Icon) {
      throw Error(`Could not find @material-ui/icons/${icon}`)
  }

  return React.createElement(Icon, props)
}

export default MaterialIcon
