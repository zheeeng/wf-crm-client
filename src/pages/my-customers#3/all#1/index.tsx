import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext } from '@roundation/store'
import contactsStore from '~src/services/contacts'
import PeopleList from '~src/components/PeopleList'

const styles = (theme: Theme) => createStyles({
})

export interface Props extends WithStyles<typeof styles>, WithContext<typeof contactsStore, 'contactsStore'> {
}

export interface State {
}

class AllMyCustomersIndex extends React.Component<Props, State> {
  render () {
    const contacts = this.props.contactsStore.contacts

    return (
      <PeopleList contacts={contacts} />
    )
  }
}

export default contactsStore.connect(
  withStyles(styles)(AllMyCustomersIndex),
  'contactsStore',
)
