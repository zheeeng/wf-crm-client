import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import contactStore from '~src/services/contact'
import DetailsPaper from '~src/units/DetailsPaper'
import ContactPageHeader from '~src/components/ContactPageHeader'
import ContactProfile from '~src/components/ContactProfile'
import ContactAssets from '~src/components/ContactAssets'
import ContactActivities from '~src/components/ContactActivities'

const styles = (theme: Theme) => createStyles({
})

export interface Props extends WithStyles<typeof styles> {
  contact: string
}

export interface State {
}

const ContactIndex: React.SFC<Props> = React.memo(props => {
  const contactContext = React.useContext(contactStore.Context)

  React.useEffect(
    () => {
      if (!props.contact) return
      contactContext.fetchContact(props.contact)
    },
    [],
  )

  if (!contactContext.contact) return null

  return (
    <DetailsPaper
      header={<ContactPageHeader />}
      rightPart1={<ContactAssets />}
      rightPart2={<ContactActivities />}
    >
      <ContactProfile />
    </DetailsPaper>
  )
})

export default contactStore.inject(withStyles(styles)(ContactIndex))
