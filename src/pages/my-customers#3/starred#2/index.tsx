import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext, ExtractContext } from '@roundation/store'
import store from '~src/services/contacts'
import PeopleList from '~src/components/PeopleList'

const styles = (theme: Theme) => createStyles({
})

export interface Props extends
  WithStyles<typeof styles>,
  WithContext<
    ExtractContext<typeof store>,
    'contactContext'
  > {
  }

export interface State {
}

class StarredMyCustomersIndex extends React.Component<Props, State> {
  private get contactContext () { return this.props.contactContext }

  componentDidMount () {
    this.contactContext.fetchContacts()
  }

  render () {
    const contacts = this.contactContext.contacts.filter(contact => contact.info.starred)

    return (
      <PeopleList contacts={contacts} />
    )
  }
}

export default store.connect(
  withStyles(styles)(StarredMyCustomersIndex),
  'contactContext',
)
