import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext } from '@roundation/store'
import contactsStore from '~src/services/contacts'
import DetailsPaper from '~src/units/DetailsPaper'

import { ComponentProps } from '@roundation/roundation/lib/types'

const styles = (theme: Theme) => createStyles({
})

export interface Props extends
  ComponentProps,
  WithStyles<typeof styles>,
  WithContext<typeof contactsStore, 'contactsStore'> {
  }

export interface State {
}

class Contact extends React.Component<Props, State> {
  // private get contactsStore () { return this.props.contactsStore }

  // private navigateToProfile = (page: string) => {
  //   this.props.navigate && this.props.navigate(page)
  // }

  render () {
    // const contacts = this.contactsStore.contacts.filter(contact => contact.info.starred)

    return (
      <DetailsPaper
        header="header"
        rightPart1="waivers"
        rightPart2="activities"
      >
        Profile
      </DetailsPaper>
    )
  }
}

export default contactsStore.connect(
  withStyles(styles)(Contact),
  'contactsStore',
)
