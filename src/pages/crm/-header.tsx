import React, { useRef, useEffect } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Link, ComponentProps } from '@roundation/roundation'
import { Theme } from '@material-ui/core/styles'
import Portal from '@material-ui/core/Portal'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'

import * as vars from '~src/theme/vars'

import logIcon from '~src/assets/logo.svg'
import cssTips from '~src/utils/cssTips'
import useSideDrawer from '~src/containers/useSideDrawer'
import useAccount from '~src/containers/useAccount'
import useAlert from '~src/containers/useAlert'
import crateGravatar from '~src/utils/createGravatar'

import MenuIcon from '@material-ui/icons/Menu'
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    flexShrink: 0,
    margin: '13px 40px',
    height: 30,
    width: 200,
    backgroundSize: '156px 22px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center left',
    backgroundImage: `url(${logIcon})`,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 2,
  },
  appBarRoot: {
    boxShadow: 'none',
  },
  toolBar: {
    padding: 0,
  },
  appAlert: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    marginTop: vars.HeaderHeight,
    width: '100%',
    height: theme.spacing(6),
    lineHeight: `${theme.spacing(6)}px`,
    color: theme.palette.grey['50'],
    opacity: 0.6,
    ...cssTips(theme).centerFlex(),
    transform: 'translateY(-100%)',
    transition: 'transform 1s',
  },
  successAlert: {
    backgroundColor: '#00cfbb',
  },
  failAlert: {
    backgroundColor: '#e53214',
  },
  alertDisplay: {
    transform: 'translateY(0)',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  dropdownButton: {
    display: 'flex',
    margin: '13px 40px',
    cursor: 'pointer',
    ...{
      '&:hover $menuList': {
        display: 'block',
      }
    }
  },
  avatarRoot: {
    height: 30,
    width: 30,
    margin: theme.spacing(0, 1.5),
  },
  arrowDown: {
    display: 'inline-block',
    margin: '10px 0',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '8px solid #fff',
    opacity: .6,
    verticalAlign: 'middle',
  },
  navList: {
    ...cssTips(theme).casFlex('row'),
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '30px',
    margin: '13px 0',
    overflow: 'hidden',
    ...cssTips(theme, { sizeFactor: 8 }).horizontallySpaced(),
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-around',
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      ...cssTips(theme, { sizeFactor: 4 }).horizontallySpaced(),
    },
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      // justifyContent: 'space-around',
      // paddingRight: 0,
      // paddingLeft: 0,
      // ...cssTips(theme, { sizeFactor: 0 }).horizontallySpaced(),
    },
    // eslint-disable-next-line @typescript-eslint/no-useless-computed-key
    ['@media (max-width:600px)']: {
      visibility: 'hidden',
    }
  },
  navItem: {
    display: 'inline-block',
    marginLeft: 25,
    marginRight: 25,
  },
  navLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
  link: {
    color: 'inherit',
    opacity: 0.6,
    textDecoration: 'none',
    transition: 'opacity 0.5s',
    ...{
      '&.active': {
        opacity: 1,
      },
      '&:hover': {
        opacity: 1,
      },
    },
  },
  profileItem: {
    color: 'white',
  },
  menuList: {
    display: 'none',
    right: theme.spacing(4),
    top: '100%',
    position: 'absolute',
    marginTop: theme.spacing(-2),
    cursor: 'default',
    backgroundColor: '#f9f9f9',
    minWidth: 160,
    boxShadow: '0 8px 16px 0 rgba(0,0,0,.2)',
    padding: '5px 0',
    borderRadius: 4,
    width: 200,
    ...{
      '&:after': {
        content: '""',
        zIndex: -1,
        position: 'absolute',
        right: 6,
        top: -8,
        width: 0,
        height: 0,
        borderLeft: '20px solid transparent',
        borderRight: '20px solid transparent',
        borderBottom: '20px solid #f9f9f9',
      },
    },
  },
  menuPaper: {
    overflow: 'visible',
  },
  menuDivider: {
    margin: '6px 20px',
    borderTop: '1px solid #d8dee8',
  },
  menuItem: {
    fontSize: 14,
    color: '#8693a7',
    padding: '6px 20px',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    lineHeight: `${theme.spacing(2.5)}px`,
    minHeight: theme.spacing(4),
    ...{
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: 'unset',
      },
      '&:hover $menuIconArchive': {
        backgroundImage: 'url(\'/app/static/images/navDropdown/nav-archives-icon-hover.svg\')',
      },
      '&:hover $menuIconSettings': {
        backgroundImage: 'url(\'/app/static/images/navDropdown/nav-settings-icon-hover.svg\')',
      },
      '&:hover $menuIconPairedDevices': {
        backgroundImage: 'url(\'/app/static/images/navDropdown/nav-paired-devices-icon-hover.svg\')',
      },
      '&:hover $menuIconPlanAndBilling': {
        backgroundImage: 'url(\'/app/static/images/navDropdown/nav-plan-and-billing-icon-hover.svg\')',
      },
      '&:hover $menuIconReferAndReward': {
        backgroundImage: 'url(\'/app/static/images/navDropdown/nav-refer-and-reward-icon-hover.svg\')',
      },
      '&:hover $menuIconSignout': {
        backgroundImage: 'url(\'/app/static/images/navDropdown/nav-signout-icon-hover.svg\')',
      },
    },
  },
  menuIcon: {
    position: 'relative',
    display: 'inline-block',
    height: 20,
    width: 30,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center left',
    verticalAlign: 'middle',
  },
  menuIconArchive: {
    backgroundImage: 'url(\'/app/static/images/navDropdown/nav-archives-icon.svg\')',
  },
  menuIconSettings: {
    backgroundImage: 'url(\'/app/static/images/navDropdown/nav-settings-icon.svg\')',
  },
  menuIconPairedDevices: {
    backgroundImage: 'url(\'/app/static/images/navDropdown/nav-paired-devices-icon.svg\')',
  },
  menuIconPlanAndBilling: {
    backgroundImage: 'url(\'/app/static/images/navDropdown/nav-plan-and-billing-icon.svg\')',
  },
  menuIconReferAndReward: {
    backgroundImage: 'url(\'/app/static/images/navDropdown/nav-refer-and-reward-icon.svg\')',
  },
  menuIconSignout: {
    backgroundImage: 'url(\'/app/static/images/navDropdown/nav-signout-icon.svg\')',
  },
}))

export interface Props extends ComponentProps {}

const Header: React.FC<Props> = React.memo(() => {
  const classes = useStyles({})
  const mountElRef = useRef(document.querySelector('#header'))
  const sideDrawer = useSideDrawer()
  const { message, dismiss } = useAlert()
  const { username, login } = useAccount()

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

  useEffect(() => { login() }, [login])

  const matchesWidth = useMediaQuery('(max-width:600px)')

  return (
    <Portal container={mountElRef.current}>
      <div>
        <AppBar
          position="absolute"
          className={classes.appBar}
          classes={{root: classes.appBarRoot}}
        >
          <Toolbar variant="dense" className={classes.toolBar}>
            <Hidden mdDown>
              <div className={classes.logo} />
            </Hidden>
            <Hidden lgUp>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
                onClick={sideDrawer.toggle}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Hidden xsDown>
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
              </nav>
            </Hidden>
            <div className={classes.dropdownButton}>
              <Avatar src={crateGravatar(username)} classes={{root: classes.avatarRoot}} />
              <div className={classes.arrowDown} />
              <MenuList
                className={classes.menuList}
              >
                <MenuItem className={classes.menuItem}>
                  {username}
                </MenuItem>
                <Divider className={classes.menuDivider}/>

                {matchesWidth &&
                  (
                    <>
                      <MenuItem className={classes.menuItem}>
                        <a href="/welcome" className={classes.navLink}>
                          Dashboard
                        </a>
                      </MenuItem>
                      <MenuItem className={classes.menuItem}>
                        <a href="/templates" className={classes.navLink}>
                          Waiver Templates
                        </a>
                      </MenuItem>
                      <MenuItem className={classes.menuItem}>
                        <a href="/crm" className={classes.navLink}>
                          My Customers
                        </a>
                      </MenuItem>
                      <Divider className={classes.menuDivider}/>
                    </>
                  )
                }

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
