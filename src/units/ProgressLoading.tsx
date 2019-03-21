import React, { useMemo } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Icon, { ICONS, Props as IconProps } from './Icons'
import { Omit } from '~src/types/utils'

const useStyles = makeStyles((theme: Theme) => ({
  ...{
    '@keyframes spin': {
      to: {
        transform: 'rotate(360deg)',
      },
    },
  },
  spin: {
    animation: '$spin'
  }
}))

interface Props extends Omit<IconProps, 'name' | 'size'> {
  size?: number,
}

const ProgressLoading: React.FC<Props> = React.memo(({ className, size, ...props }) => {
  const classes = useStyles({})

  const style = useMemo<React.CSSProperties>(() => ({ width: size, height: size }), [size])

  return <Icon {...props} style={style} name={ICONS.Loading} className={classnames(className, classes.spin )} />
})


export default ProgressLoading
