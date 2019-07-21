import React, { useRef } from 'react'
import classnames from 'classnames'
import Toolbar from '@material-ui/core/Toolbar'
import ProgressLoading from '~src/units/ProgressLoading'
import Portal from '@material-ui/core/Portal'
import AppBar from '@material-ui/core/AppBar'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import { Divider } from '@material-ui/core'

import { Link } from '@roundation/roundation'
import useHeaderStyles from '~src/styles/useHeaderStyles'
import useLayoutStyles from '~src/styles/useLayoutStyles'

const SkeletonHeader: React.FC = () => {
  const classes = useHeaderStyles()
  const mountElRef = useRef(document.querySelector('#header'))

  return (
    <Portal container={mountElRef.current}>
      <div data-portal>
        <AppBar
          position="absolute"
          className={classes.appBar}
          classes={{root: classes.appBarRoot}}
        >
          <Toolbar variant="dense" className={classes.toolBar}>
            <div className={classes.logo} />
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <nav className={classes.navList}>
              <div className={classes.navItem}>
                <a href="/welcome" className={classes.link}>
                  Dashboard
                </a>
              </div>
              <div className={classes.navItem}>
                <a href="/templates" className={classes.link}>
                  Waiver Templates
                </a>
              </div>
              <div className={classes.navItem}>
                <Link to="/crm" className={classnames(classes.link, 'active')}>
                  My Customers
                </Link>
              </div>
              <div className={classes.navItem}>
                <a href="/waiver-list" className={classes.link}>
                  My Waiver List
                </a>
              </div>
            </nav>
            <div className={classes.dropdownButton}>
              <div className={classes.arrowDown} />
              <MenuList
                className={classes.menuList}
              >
                <MenuItem className={classes.menuItem} />
                <Divider className={classes.menuDivider}/>

                <MenuItem className={classnames(classes.menuItem, classes.navItemInMenu)}>
                  <a href="/welcome" className={classes.navLink}>
                    Dashboard
                  </a>
                </MenuItem>
                <MenuItem className={classnames(classes.menuItem, classes.navItemInMenu)}>
                  <a href="/templates" className={classes.navLink}>
                    Waiver Templates
                  </a>
                </MenuItem>
                <MenuItem className={classnames(classes.menuItem, classes.navItemInMenu)}>
                  <a href="/crm" className={classes.navLink}>
                    My Customers
                  </a>
                </MenuItem>
                <MenuItem className={classnames(classes.menuItem, classes.navItemInMenu)}>
                  <a href="/waiver-list" className={classes.navLink}>
                    My Waiver List
                  </a>
                </MenuItem>
                <Divider className={classnames(classes.menuDivider, classes.navItemInMenu)}/>

                <MenuItem className={classes.menuItem}>
                  <a
                    className={classes.navLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://help.waiverforever.com/"
                  > Help Center</a>
                </MenuItem>
                <Divider className={classes.menuDivider}/>
                <MenuItem className={classes.menuItem}>
                  <a className={classes.navLink} target="_self" href="/archive">
                    <i className={classnames(classes.menuIcon, classes.menuIconArchive)} />
                    Archives
                  </a>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  <a className={classes.navLink} target="_self" href="/settings/general">
                    <i className={classnames(classes.menuIcon, classes.menuIconSettings)} />
                    Account Settings
                  </a>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  <a className={classes.navLink} target="_self" href="/devices">
                    <i className={classnames(classes.menuIcon, classes.menuIconPairedDevices)} />
                    Paired Devices
                  </a>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  <a className={classes.navLink} target="_self" href="/plan_and_billing">
                    <i className={classnames(classes.menuIcon, classes.menuIconPlanAndBilling)} />
                    Plan & Billing
                  </a>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  <a className={classes.navLink} target="_self" href="/plan_and_billing/referrals">
                    <i className={classnames(classes.menuIcon, classes.menuIconReferAndReward)} />
                    Referral & Rewards
                  </a>
                </MenuItem>
                <Divider className={classes.menuDivider}/>
                <MenuItem className={classes.menuItem}>
                  <a className={classes.navLink} target="_self" href="/auth/signout">
                    <i className={classnames(classes.menuIcon, classes.menuIconSignout)} />
                    Sign out
                  </a>
                </MenuItem>
              </MenuList>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </Portal>
  )
}

const SkeletonApp: React.FC = () => {
  const classes = useLayoutStyles()

  return (
    <div className={classes.root}>
      <SkeletonHeader />
      <div className={classes.main}>
        <Toolbar variant="dense" />
        <div className={classes.loadingContainer}>
          <ProgressLoading className={classes.progress} />
        </div>
      </div>
    </div>
  )
}

export default SkeletonApp
