import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext } from '@roundation/store'
import groupsStore from '~src/services/groups'
import contactsStore from '~src/services/contacts'

import { ComponentProps } from '@roundation/roundation/lib/types'

// const { Provider } = store

const styles = (theme: Theme) => createStyles({
})

export interface Props extends
  WithStyles<typeof styles>,
  WithContext<typeof contactsStore, 'contactsStore'>,
  WithContext<typeof groupsStore, 'groupsStore'>,
  ComponentProps<'aside'> {
}

class MyCustomersLayout extends React.Component<Props> {
  render () {
    return (
      <>
        {this.props.slots.aside}
        {this.props.children}
      </>
    )
  }

  componentDidMount () {
    this.props.groupsStore.fetchGroups()
    this.props.contactsStore.fetchContacts()
  }
}

export default groupsStore.inject(
  contactsStore.inject(
    groupsStore.connect(
      contactsStore.connect(
        withStyles(styles)(MyCustomersLayout),
        'contactsStore',
      ),
      'groupsStore',
    ),
  ),
)
