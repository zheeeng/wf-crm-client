import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext } from '@roundation/store'
import contactsStore from '~src/services/contacts'
import DetailsPaper from '~src/units/DetailsPaper'

const styles = (theme: Theme) => createStyles({
})

export interface Props extends WithStyles<typeof styles>, WithContext<typeof contactsStore, 'contactsStore'> {
}

export interface State {
}

const Contact: React.SFC<Props> = React.memo((props: Props) => {
  const contactsContext = React.useContext(contactsStore.Context)

  return (
    <DetailsPaper
      header="header"
      rightPart1="waivers"
      rightPart2="activities"
    >
      Profile
    </DetailsPaper>
  )
})

export default withStyles(styles)(Contact)
