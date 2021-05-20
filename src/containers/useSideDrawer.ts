import constate from 'constate'
import { useBoolean } from 'react-hanger'

export const [UseSideDrawerProvider, useSideDrawer] = constate(() =>
  useBoolean(false),
)
