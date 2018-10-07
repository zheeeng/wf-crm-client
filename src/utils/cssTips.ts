import { createStyles, Theme } from '@material-ui/core/styles'

export interface TipOption {
  sizeFactor: number
}

export const getDefaultOption = (): TipOption => ({
  sizeFactor: 2,
})

const cssTips = (theme: Theme, option: Partial<TipOption> = {}) => {
  const tipOption: TipOption = { ...getDefaultOption(), ...option }

  return createStyles({
    horizontallySpaced: {
      '& > *': {
        marginRight: theme.spacing.unit * tipOption.sizeFactor,
      },
      '& > *:last-child': {
        marginRight: 0,
      },
    },
    verticallySpaced: {
      '& > *': {
        marginBottom: theme.spacing.unit * tipOption.sizeFactor,
      },
      '& > *:last-child': {
        marginBottom: 0,
      },
    },
  })
}

export default cssTips
