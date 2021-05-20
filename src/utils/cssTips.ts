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
    centerFlex: (
      justifyContent:
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'normal' = 'center',
    ) =>
      createStyles({
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent,
        },
      }).style,
    growFlex: () =>
      createStyles({
        style: {
          flex: 1,
          minHeight: 0,
        },
      }).style,
    casFlex: (direction: 'column' | 'row' = 'column') =>
      createStyles({
        style: {
          flexGrow: 1,
          flexBasis: '100%',
          display: 'flex',
          minHeight: 0,
          flexDirection: direction,
        },
      }).style,
    lineClamp: (line: number) =>
      createStyles({
        style: {
          display: '-webkit-box',
          '-webkit-line-clamp': line,
          '-webkit-box-orient': 'vertical',
        },
      }).style,
    horizontallySpaced: () =>
      createStyles({
        style: {
          '& > *': {
            marginRight: theme.spacing(tipOption.sizeFactor),
          },
          '& > *:last-child': {
            marginRight: 0,
          },
        },
      }).style,
    verticallySpaced: () =>
      createStyles({
        style: {
          '& > *': {
            marginBottom: theme.spacing(tipOption.sizeFactor),
          },
          '& > *:last-child': {
            marginBottom: 0,
          },
        },
      }).style,
    svgIcon: () =>
      createStyles({
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
