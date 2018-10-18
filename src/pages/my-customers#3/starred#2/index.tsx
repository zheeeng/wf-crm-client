import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext } from '@roundation/store'
import contactsStore from '~src/services/contacts'
import PeopleList from '~src/components/PeopleList'

const styles = (theme: Theme) => createStyles({
})

export interface Props extends WithStyles<typeof styles>, WithContext<typeof contactsStore, 'contactStore'> {
}

export interface State {
}

class StarredMyCustomersIndex extends React.Component<Props, State> {
  private get contactStore () { return this.props.contactStore }

  componentDidMount () {
    this.contactStore.fetchContacts()
  }

  render () {
    const contacts = this.contactStore.contacts.filter(contact => contact.info.starred)

    return (
      <PeopleList contacts={contacts} />
    )
  }
}

export default contactsStore.connect(
  withStyles(styles)(StarredMyCustomersIndex),
  'contactStore',
)
