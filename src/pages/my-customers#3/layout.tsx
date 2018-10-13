import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { WithContext, ExtractContext } from '@roundation/store'
import store from '~src/services/contacts'

// const { Provider } = store

const styles = (theme: Theme) => createStyles({
})

export interface Props extends
  WithStyles<typeof styles>,
  WithContext<
  ExtractContext<typeof store>,
    'contactContext'
  > {
    aside?: JSX.Element | JSX.Element[]
  }

class MyCustomersLayout extends React.Component<Props> {
  componentDidMount () {
    this.props.contactContext.fetchContacts()
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

export default store.inject(
  store.connect(
    withStyles(styles)(MyCustomersLayout),
    'contactContext',
    ),
  )
