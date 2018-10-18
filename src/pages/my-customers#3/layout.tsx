import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext } from '@roundation/store'
import contactsStore from '~src/services/contacts'

// const { Provider } = store

const styles = (theme: Theme) => createStyles({
})

export interface Props extends WithStyles<typeof styles>, WithContext<typeof contactsStore, 'contactStore'> {
  aside?: JSX.Element | JSX.Element[]
}

class MyCustomersLayout extends React.Component<Props> {
  componentDidMount () {
    this.props.contactStore.fetchContacts()
  }

  render () {
    return (
      <>
        {this.props.aside}
        {this.props.children}
      </>
    )
  }
}

export default contactsStore.inject(
  contactsStore.connect(
    withStyles(styles)(MyCustomersLayout),
    'contactStore',
    ),
  )
