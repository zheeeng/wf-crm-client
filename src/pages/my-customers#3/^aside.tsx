import * as React from 'react'
import { Link } from '@roundation/roundation'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Portal from '@material-ui/core/Portal'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import BeachAccessIcon from '@material-ui/icons/BeachAccess'
import StarIcon from '@material-ui/icons/Star'
import { WithContext, ExtractContext } from '@roundation/store'
import store from '~src/services/contacts'

import { ComponentProps } from '@roundation/roundation/dist/types'

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  drawerPaper: {
    position: 'fixed',
    width: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit * 30,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0,
    // TODO:: Change to 100%
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 0 5px 1px lightgrey',
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
})

export interface Props extends
  WithStyles<typeof styles>,
  ComponentProps<any>,
  WithContext<
    ExtractContext<typeof store>,
    'contactContext'
  > {}

class Aside extends React.Component<Props> {
  $mountEl = document.querySelector('#sidebar')

  render () {
    const { classes, locationInfo } = this.props
    const subPageNavs = locationInfo.list().map(({ name, routePath }) => ({ name, routePath}))
    console.log(locationInfo.list())

    const allCounts = this.props.contactContext!.contacts.length
    const starredCounts = this.props.contactContext!.contacts.filter(contact => contact.info.starred).length

    return (
      <Portal container={this.$mountEl as any}>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem>
              <ListItemIcon>
                <BeachAccessIcon />
              </ListItemIcon>
              <ListItemText inset>
                Contacts
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List>{subPageNavs.map(({ routePath, name }) => (
            <ListItem key={routePath}>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText inset>
                <Link to={routePath}>{
                  name === 'All'
                    ? `${name}(${allCounts})`
                    : name === 'Starred'
                      ? `${name}(${starredCounts})`
                      : name
                }</Link>
              </ListItemText>
            </ListItem>
          ))}</List>
        </Drawer>
      </Portal>
    )
  }
}

export default store.connect(
  withStyles(styles)(Aside) as any,
  'contactContext',
)
