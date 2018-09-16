import * as React from 'react'
import { withStyles, createStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import BeachAccessIcon from '@material-ui/icons/BeachAccess'
import StarIcon from '@material-ui/icons/Star'

const drawerWidth = 240

const mailFolderListItems = ['Contacts']
const otherMailFolderListItems = ['All', 'Starred', 'Groups']

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
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    flexGrow: 1,
    marginLeft: drawerWidth,
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

export interface Props extends WithStyles<typeof styles> {
  header?: JSX.Element | JSX.Element[]
  footer?: JSX.Element | JSX.Element[]
  aside?: JSX.Element | JSX.Element[]
}

class App extends React.Component<Props> {

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        {this.props.header}
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>{mailFolderListItems.map(item => (
            <ListItem>
              <ListItemIcon>
                <BeachAccessIcon />
              </ListItemIcon>
              <ListItemText inset>
                {item}
              </ListItemText>
            </ListItem>
          ))}</List>
          <Divider />
          <List>{otherMailFolderListItems.map(item => (
            <ListItem>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText inset>
                {item}
              </ListItemText>
            </ListItem>
          ))}</List>
        </Drawer>
        <main className={classes.main}>
          <div className={classes.toolbar} />
          <div className={classes.content}>
            {this.props.children}
          </div>
        </main>
      </div>
    )
  }
}

export default withStyles(styles)(App)
