import React, { useRef } from 'react'
import classnames from 'classnames'
import { Link, ComponentProps } from '@roundation/roundation'
import Portal from '@material-ui/core/Portal'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import { Divider } from '@material-ui/core'

import { useSideDrawer } from '~src/containers/useSideDrawer'
import { useAccount } from '~src/containers/useAccount'
import { useAlert } from '~src/containers/useAlert'
import crateGravatar from '~src/utils/createGravatar'
import useStyles from '~src/styles/useHeaderStyles'

import { ReactComponent as DashboardIcon } from '~src/assets/nav-icons/icon_dashboard.svg'
import { ReactComponent as TemplateIcon } from '~src/assets/nav-icons/icon_template.svg'
import { ReactComponent as CustomersIcon } from '~src/assets/nav-icons/icon_customers.svg'
import { ReactComponent as WaiverlistIcon } from '~src/assets/nav-icons/icon_waiverlist.svg'

export interface Props extends ComponentProps {}

const Header: React.FC<Props> = React.memo(() => {
  const classes = useStyles({})
  const mountElRef = useRef(document.querySelector('#header'))
  const sideDrawer = useSideDrawer()
  const { message, dismiss } = useAlert()
  const { username } = useAccount()

  // const handleMenuToggle = useCallback(
  //   (forOpen: boolean) => (event: React.MouseEvent<HTMLElement>) => {
  //     if (forOpen) {
  //       setOpenAccount(true)
  //       !anchorEl && setAnchorEl(event.currentTarget)
  //     } else {
  //       setOpenAccount(false)
  //     }
  //   },
  //   [anchorEl, openAccount],
  // )

  return (
    <Portal container={mountElRef.current}>
      <div data-portal>
        <AppBar
          position="absolute"
          className={classes.appBar}
          classes={{ root: classes.appBarRoot }}
        >
          <Toolbar variant="dense" className={classes.toolBar}>
            <div className={classes.logo} />
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={sideDrawer.toggle}
            >
              <MenuIcon />
            </IconButton>
            <nav className={classes.navList}>
              <div className={classes.navItem}>
                <a href="/welcome" className={classes.link}>
                  Dashboard
                </a>
                <div className={classes.linkIcon}>
                  <DashboardIcon className={classes.linkIcon} />
                </div>
              </div>
              <div className={classes.navItem}>
                <a href="/templates" className={classes.link}>
                  Waiver Templates
                </a>
                <div className={classes.linkIcon}>
                  <TemplateIcon className={classes.linkIcon} />
                </div>
              </div>
              <div className={classes.navItem}>
                <Link to="/crm" className={classnames(classes.link, 'active')}>
                  My Customers
                </Link>
                <div className={classnames(classes.linkIcon, 'active')}>
                  <CustomersIcon />
                </div>
              </div>
              <div className={classes.navItem}>
                <a href="/waiver-list" className={classes.link}>
                  My Waiver List
                </a>
                <div className={classes.linkIcon}>
                  <WaiverlistIcon className={classes.linkIcon} />
                </div>
              </div>
            </nav>
            <div className={classes.dropdownButton}>
              <Avatar
                src={crateGravatar(username)}
                classes={{ root: classes.avatarRoot }}
              />
              <div className={classes.arrowDown} />
              <MenuList className={classes.menuList}>
                <MenuItem className={classes.menuItem}>{username}</MenuItem>
                <Divider className={classes.menuDivider} />

                {/* <MenuItem className={classnames(classes.menuItem, classes.navItemInMenu)}>
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
                <Divider className={classnames(classes.menuDivider, classes.navItemInMenu)}/> */}

                <MenuItem className={classes.menuItem}>
                  <a
                    className={classes.navLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://help.waiverforever.com/"
                  >
                    {' '}
                    Help Center
                  </a>
                </MenuItem>
                <Divider className={classes.menuDivider} />
                <MenuItem className={classes.menuItem}>
                  <a className={classes.navLink} target="_self" href="/archive">
                    <i
                      className={classnames(
                        classes.menuIcon,
                        classes.menuIconArchive,
                      )}
                    />
                    Archives
                  </a>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  <a
                    className={classes.navLink}
                    target="_self"
                    href="/settings/general"
                  >
                    <i
                      className={classnames(
                        classes.menuIcon,
                        classes.menuIconSettings,
                      )}
                    />
                    Account Settings
                  </a>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  <a className={classes.navLink} target="_self" href="/devices">
                    <i
                      className={classnames(
                        classes.menuIcon,
                        classes.menuIconPairedDevices,
                      )}
                    />
                    Paired Devices
                  </a>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  <a
                    className={classes.navLink}
                    target="_self"
                    href="/plan_and_billing"
                  >
                    <i
                      className={classnames(
                        classes.menuIcon,
                        classes.menuIconPlanAndBilling,
                      )}
                    />
                    Plan & Billing
                  </a>
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                  <a
                    className={classes.navLink}
                    target="_self"
                    href="/plan_and_billing/referrals"
                  >
                    <i
                      className={classnames(
                        classes.menuIcon,
                        classes.menuIconReferAndReward,
                      )}
                    />
                    Referral & Rewards
                  </a>
                </MenuItem>
                <Divider className={classes.menuDivider} />
                <MenuItem className={classes.menuItem}>
                  <a
                    className={classes.navLink}
                    target="_self"
                    href="/auth/signout"
                  >
                    <i
                      className={classnames(
                        classes.menuIcon,
                        classes.menuIconSignout,
                      )}
                    />
                    Sign out
                  </a>
                </MenuItem>
              </MenuList>
            </div>
          </Toolbar>
        </AppBar>
        <Typography
          variant="h6"
          className={classnames(
            message.expand && classes.alertDisplay,
            classes.appAlert,
            message.type === 'success'
              ? classes.successAlert
              : classes.failAlert,
          )}
          onClick={dismiss}
        >
          {message.content}
        </Typography>
      </div>
    </Portal>
  )
})

export default Header
