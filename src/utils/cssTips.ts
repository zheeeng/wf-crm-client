import { createStyles, Theme } from '@material-ui/core/styles'

export interface TipOption {
  sizeFactor: number
  svgIconFactor: number
}

export const getDefaultOption = (): TipOption => ({
  sizeFactor: 2,
  svgIconFactor: 3,
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
    svgIcon: () => createStyles({
      style: {
        display: 'inline-block',
        fill: 'currentColor',
        width: theme.spacing.unit * tipOption.svgIconFactor,
        height: theme.spacing.unit * tipOption.svgIconFactor,
      },
    }).style,
  }
}

export default cssTips
