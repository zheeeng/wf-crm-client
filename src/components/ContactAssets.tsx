import React, { useState, useCallback, useEffect, useContext } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Skeleton from 'react-skeleton-loader'

import useToggle from '~src/hooks/useToggle'
import ExportContactsForm from '~src/components/ExportContactsForm'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import useContact from '~src/containers/useContact'
import WaiverSplitterContainer from '~src/containers/WaiverSplitter'
import { getDateAndTime } from '~src/utils/getDate'
import cssTips from '~src/utils/cssTips'

import Icon, { ICONS } from '~src/units/Icons'

const useStyles = makeStyles((theme: Theme) => ({
  tabsWrapper: {
    ...cssTips(theme).centerFlex('space-between'),
    padding: theme.spacing(0, 4),
    marginBottom: theme.spacing(2),
  },
  tabIndicator: {
    height: 2,
    borderRadius: 4,
    boxShadow: '0 0 2px 2px',
  },
  title: {
    color: theme.palette.grey[800],
    fontSize: 20,
  },
  entry: {
    ...cssTips(theme).centerFlex('normal'),
    padding: theme.spacing(0, 1.5),
    height: theme.spacing(4),
    lineHeight: `${theme.spacing(4.5)}px`,
    marginBottom: theme.spacing(1),
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: theme.palette.grey[800],
    ...{
      '&:hover': {
        backgroundColor: theme.palette.grey[900],
      },
    },
  },
  skeletonEntry: {
    '&:hover': {
      backgroundColor: 'unset',
    },
    '& span': {
      display: 'block',
      width: '100%',
    },
  },
  uploadButton: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  pointer: {
    cursor: 'pointer',
  },
  entryIcon: {
    marginRight: theme.spacing(1),
  },
  entryContent: {
    flexGrow: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  entryTime: {
    width: 128,
    textAlign: 'right',
    fontSize: '0.75rem',
    ...{
      '$entry:hover &': {
        display: 'none',
      },
    },
    color: theme.palette.grey[800],
    whiteSpace: 'nowrap',
  },
  entryButtons: {
    display: 'none',
    ...{
      '$entry:hover &': {
        display: 'block',
      },
    },
  },
  entryButton: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
  },
  entryButtonIcon: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  progressWrapper: {
    width: '100%',
    maxHeight: '100%',
    ...cssTips(theme).centerFlex(),
  },
  progress: {
    margin: theme.spacing(2),
  },
  waiverContent: {
    margin: theme.spacing(0, 3),
    [theme.breakpoints.up('md')]: {
      flexGrow: 1,
      height: '100%',
      overflow: 'auto',
    },
  },
}))

export interface Props {
  contactId: string
}

const ContactAssets: React.FC<Props> = React.memo(({ contactId }) => {
  const classes = useStyles({})

  const { readyToSplitWaiver, splitMutation } = useContext(WaiverSplitterContainer.Context)

  const [currentTab, setCurrentTab] = useState(0)

  const handleCurrentTabChange = useCallback(
    (_: any, value: number) => setCurrentTab(value),
    [currentTab],
  )

  const {
    waivers, fetchWaivers, isFetchingWaivers, fetchWaiversError,
   } = useContact(contactId)

  useEffect(() => { fetchWaivers() }, [contactId, splitMutation])

  const handleOpenWaiverSplitter = useCallback(
    (id: string, title: string) => (e: React.SyntheticEvent) => {
      e.stopPropagation()

      return readyToSplitWaiver(id, title)
    },
    [readyToSplitWaiver],
  )

  const {
    value: exportContactsOpened,
    // toggleOn: toggleOnExportContactsOpened,
    toggleOff: toggleOffExportContactsOpened,
  } = useToggle(false)

  const openWaiverExportPage = useCallback(
    (key: string) => () => { window.open(`/get_signed_doc/${key}`, '_blank') },
    [],
  )

  return (
    <ContactTableThemeProvider>
      <ExportContactsForm
        open={exportContactsOpened}
        onClose={toggleOffExportContactsOpened}
        contactIds={[contactId]}
      />
      <div className={classes.tabsWrapper}>
        <Tabs
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleCurrentTabChange}
          classes={{
             indicator: classes.tabIndicator,
          }}
        >
          <Tab
            label={<Typography variant="h4"
            className={classes.title}
          >Waivers</Typography>}
          />
          {/* <Tab
            label={<Typography variant="h4">Attachments</Typography>}
          /> */}
        </Tabs>
        {currentTab === 1 && (
          <Button
            className={classes.uploadButton}
            variant="outlined"
            color="primary"
          >Upload</Button>
        )}
      </div>
      {currentTab === 0
      && isFetchingWaivers
      ? (
        <div className={classes.waiverContent}>
          {Array.from(({ length: 3 }), (_, index) => (
            <div className={classnames(classes.entry, classes.skeletonEntry)} key={index} >
              <Skeleton widthRandomness={0} width="100%"/>
            </div>
          ))}
        </div>
      )
      : fetchWaiversError
      ? (
        <Typography align="center">Oops, an error occurred!</Typography>
      )
      : (
        <div className={classes.waiverContent}>
          {waivers.map(waiver => (
            <div key={waiver.key} className={classnames(classes.entry, classes.pointer)} onClick={openWaiverExportPage(waiver.key)}>
              <Icon
                name={ICONS.Waiver}
                className={classes.entryIcon}
              />
              <span className={classes.entryContent}>{waiver.title}</span>
              <time className={classes.entryTime}>{getDateAndTime(waiver.signedTimestamp)}</time>
              <div className={classes.entryButtons}>
                <Tooltip title="split">
                  <IconButton
                    className={classes.entryButton}
                    classes={{
                      label: classes.entryButtonIcon,
                    }}
                    onClick={handleOpenWaiverSplitter(waiver.id, waiver.title)}
                  >
                    <Icon name={ICONS.Split} size="sm" color="hoverLighten" />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="export">
                  <IconButton
                    className={classes.entryButton}
                    classes={{
                      label: classes.entryButtonIcon,
                    }}
                    onClick={openWaiverExportPage(waiver.key)}
                    // onClick={toggleOnExportContactsOpened}
                  >
                    <Icon name={ICONS.Download} size="sm" color="hoverLighten" />
                  </IconButton>
                </Tooltip> */}
              </div>
            </div>
          ))}
        </div>
      )}
      {currentTab === 1 && (
        <div>
          <div className={classes.entry}>
            <Icon
              name={ICONS.Waiver}
              className={classes.entryIcon}
              color="primary"
            />
            <span className={classes.entryContent}>agreement.pdf</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
          <div className={classes.entry}>
            <Icon
              name={ICONS.Waiver}
              className={classes.entryIcon}
              color="primary"
            />
            <span className={classes.entryContent}>Customer_waiver.word</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
          <div className={classes.entry}>
            <Icon
              name={ICONS.Waiver}
              className={classes.entryIcon}
              color="primary"
            />
            <span className={classes.entryContent}>Business_strategy.ppt</span>
            <time className={classes.entryTime}>July 22, 2017, 6:30 pm</time>
          </div>
        </div>
      )}
    </ContactTableThemeProvider>
  )
})

export default ContactAssets
