import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import contactsStore from '~src/services/contacts'
import PeopleList from '~src/components/PeopleList'

import { ComponentProps } from '@roundation/roundation/lib/types'

const styles = (theme: Theme) => createStyles({
})

export interface Props extends
  ComponentProps,
  WithStyles<typeof styles> {
}

export interface State {
}

const AllMyCustomersIndex: React.FC<Props> = React.memo(({ navigate }) => {
  const contactsContext = React.useContext(contactsStore.Context)

  React.useEffect(
    () => {
      contactsContext.fetchContacts()
    },
    [],
  )

  const starContact = React.useCallback(
    (id: string, star: boolean) => {
      contactsContext.starContact(id, star)
    },
    [contactsContext.contacts],
  )

  const searchContacts = React.useCallback(
    ({page = 0, size = 30, searchTerm = ''}) => {
      contactsContext.fetchContacts({
        page: page + 1, size, searchTerm,
      })
    },
    [contactsContext.contacts],
  )

  const navigateToProfile = React.useCallback(
    (page: string) => {
      navigate && navigate(page)
    },
    [navigate],
  )

  return (
    <PeopleList
      page={contactsContext.page - 1}
      size={contactsContext.size}
      total={contactsContext.total}
      onStar={starContact}
      onSearch={searchContacts}
      contacts={contactsContext.contacts}
      navigateToProfile={navigateToProfile}
      onSubmitContact={contactsContext.addContact}
    />
  )
})

export default contactsStore.inject(
  withStyles(styles)(AllMyCustomersIndex),
)
