import { createStyles, Theme } from '@material-ui/core/styles'

export interface TipOption {
  sizeFactor: number
  iconBgFactor: number
}

export const getDefaultOption = (): TipOption => ({
  sizeFactor: 2,
  iconBgFactor: 3,
})

const cssTips = (theme: Theme, option: Partial<TipOption> = {}) => {
  const tipOption: TipOption = { ...getDefaultOption(), ...option }

  return {
    horizontallySpaced: () => createStyles({
      style: {
        '& > *': {
          marginRight: theme.spacing.unit * tipOption.sizeFactor,
        },
        '& > *:last-child': {
          marginRight: 0,
        },
      },
    }).style,
    verticallySpaced: () => createStyles({
      style: {
        '& > *': {
          marginBottom: theme.spacing.unit * tipOption.sizeFactor,
        },
        '& > *:last-child': {
          marginBottom: 0,
        },
      },
    }).style,
    iconBg: () => createStyles({
      style: {
        display: 'inline-block',
        width: theme.spacing.unit * tipOption.iconBgFactor,
        height: theme.spacing.unit * tipOption.iconBgFactor,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      },
    }).style,
  }
}

export default cssTips
