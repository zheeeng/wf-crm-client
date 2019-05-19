import { createStyles, Theme } from '@material-ui/core/styles'

export interface TipOption {
  sizeFactor: number
  svgIconFactor: number
}

export const getDefaultOption = (): TipOption => ({
  sizeFactor: 2,
  svgIconFactor: 2.5,
})

const cssTips = (theme: Theme, option: Partial<TipOption> = {}) => {
  const tipOption: TipOption = { ...getDefaultOption(), ...option }

  return {
    lineClamp: (line: number) => createStyles({
      style: {
        display: '-webkit-box',
        '-webkit-line-clamp': line,
        '-webkit-box-orient': 'vertical',
      },
    }).style,
    horizontallySpaced: () => createStyles({
      style: {
        '& > *': {
          marginRight: theme.spacing(tipOption.sizeFactor),
        },
        '& > *:last-child': {
          marginRight: 0,
        },
      },
    }).style,
    verticallySpaced: () => createStyles({
      style: {
        '& > *': {
          marginBottom: theme.spacing(tipOption.sizeFactor),
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
        width: theme.spacing(tipOption.svgIconFactor),
        height: theme.spacing(tipOption.svgIconFactor),
      },
    }).style,
  }
}

export default cssTips
