import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import logIcon from '~src/assets/logo.svg'
import logNoTextIcon from '~src/assets/logo-no-text.svg'
import cssTips from '~src/utils/cssTips'

import * as vars from '~src/theme/vars'

export const useHeaderStyles = makeStyles((theme: Theme) => ({
  logo: {
    flexShrink: 0,
    margin: '13px 40px',
    height: 30,
    width: 200,
    backgroundSize: '156px 22px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center left',
    backgroundImage: `url(${logIcon})`,
    [theme.breakpoints.down('md')]: {
      display: 'none',
      width: 50,
      backgroundSize: '36px 22px',
      backgroundImage: `url(${logNoTextIcon})`,
    },
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
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
  dropdownButton: {
    display: 'flex',
    margin: '13px 40px',
    cursor: 'pointer',
    '&:hover $menuList': {
      display: 'block',
    },
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
    // eslint-disable-next-line no-useless-computed-key
    ['@media (max-width:600px)']: {
      visibility: 'hidden',
    },
  },
  navItem: {
    display: 'inline-block',
    marginLeft: 25,
    marginRight: 25,
    '@media (max-width:1100px)': {
      marginLeft: 0,
    },
    '@media (max-width:991px)': {
      marginRight: 20,
    },
    '@media (max-width:880px)': {
      marginRight: 8,
    },
    '@media (max-width:749.9999999px)': {
      display: 'none',
    },
  },
  navItemInMenu: {
    '@media (min-width:750px)': {
      display: 'none',
    },
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
    '&.active': {
      opacity: 1,
    },
    '&:hover': {
      opacity: 1,
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

export default useHeaderStyles
