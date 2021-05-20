import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useBoolean } from 'react-hanger'
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

import ExportContactsForm from '~src/components/ExportContactsForm'
import { useContact } from '~src/containers/useContact'
import { getDateAndTime } from '~src/utils/getDate'
import cssTips from '~src/utils/cssTips'

import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import { useWaiverSplitter } from '~src/containers/useWaiverSplitter'

import Icon, { ICONS } from '~src/units/Icons'
import {
  RequestWaiverPopup,
  SendMoreWaiverPopup,
} from '@waiverforever/request-waiver-popup'
import '@waiverforever/request-waiver-popup/dist/style.css'
import { useRequestWaiver } from '~src/common/useRequestWaiver'

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
    // enable after having multiple task
    display: 'none',
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
    '&:hover': {
      backgroundColor: theme.palette.grey[900],
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
  makeRequestButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  makeRequestButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    cursor: 'pointer',
  },
  pointer: {
    cursor: 'pointer',
  },
  entryIcon: {
    flexShrink: 0,
    marginRight: theme.spacing(1),
  },
  entryContent: {
    flexGrow: 1,
    flexBasis: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  entryTime: {
    width: 128,
    textAlign: 'right',
    fontSize: '0.75rem',
    color: theme.palette.grey[800],
    whiteSpace: 'nowrap',
    '$entry:hover &': {
      display: 'none',
    },
  },
  entryButtons: {
    display: 'none',
    '$entry:hover &': {
      display: 'flex',
    },
  },
  entryButton: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    cursor: 'pointer',
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
    margin: theme.spacing(0, 1.5),
    padding: theme.spacing(0, 1.5),
    [theme.breakpoints.up('md')]: {
      flexGrow: 1,
      flexBasis: '100%',
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

  const [currentTab, setCurrentTab] = useState(0)

  const { readyToSplitWaiver, splitMutation } = useWaiverSplitter()

  const handleCurrentTabChange = useCallback(
    (_: any, value: number) => setCurrentTab(value),
    [setCurrentTab],
  )

  const {
    contact,
    waivers,
    fetchWaivers,
    isFetchingWaivers,
    fetchWaiversError,
  } = useContact(contactId)

  const { requestWaiverPopupProps, setRequestNewVisible, setVisible } =
    useRequestWaiver(fetchWaivers)

  useEffect(() => {
    fetchWaivers()
  }, [contactId, fetchWaivers, splitMutation])

  const handleOpenWaiverSplitter = useCallback(
    (id: string, title: string) => (e: React.SyntheticEvent) => {
      e.stopPropagation()

      return readyToSplitWaiver(id, title)
    },
    [readyToSplitWaiver],
  )

  const {
    value: exportContactsOpened,
    // setTrue: toggleOnExportContactsOpened,
    setFalse: toggleOffExportContactsOpened,
  } = useBoolean(false)

  const openWaiverExportPage = useCallback(
    (key: string) => () => {
      window.open(`/get_signed_doc/${key}`, '_blank')
    },
    [],
  )

  const initialContactEmail = useMemo(
    () => (contact ? `${contact.info.name}<${contact.info.email}>` : ''),
    [contact],
  )

  const requestWaiverRequesting = useCallback(
    (waiverId: string) => (e: React.SyntheticEvent) => {
      e.stopPropagation()
      setVisible(initialContactEmail, waiverId)
    },
    [setVisible, initialContactEmail],
  )

  const requestMoreWaiverRequesting = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation()
      setRequestNewVisible(initialContactEmail)
    },
    [setRequestNewVisible, initialContactEmail],
  )

  return (
    <ContactTableThemeProvider>
      <RequestWaiverPopup
        initialRecipient={requestWaiverPopupProps.initialRecipient}
        visible={requestWaiverPopupProps.sendFromWaiverVisible}
        onVisibleChange={requestWaiverPopupProps.handleVisibleChange}
        submitData={requestWaiverPopupProps.submitRequest}
        addEmail={requestWaiverPopupProps.sendEmailRequest}
        getEmails={requestWaiverPopupProps.getVerifiedEmails}
        verifyEmail={requestWaiverPopupProps.verifyEmail}
        getTemplates={requestWaiverPopupProps.getTemplates}
      />
      <SendMoreWaiverPopup
        initialRecipient={requestWaiverPopupProps.initialRecipient}
        visible={requestWaiverPopupProps.requestVisible}
        onVisibleChange={requestWaiverPopupProps.handleVisibleChange}
        submitData={requestWaiverPopupProps.submitRequestWithTemplate}
        addEmail={requestWaiverPopupProps.sendEmailRequest}
        getEmails={requestWaiverPopupProps.getVerifiedEmails}
        verifyEmail={requestWaiverPopupProps.verifyEmail}
        getTemplates={requestWaiverPopupProps.getTemplates}
        showHideSignedCheckbox
      />
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
            label={
              <Typography variant="h4" className={classes.title}>
                Waivers
              </Typography>
            }
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
          >
            Upload
          </Button>
        )}
      </div>
      {currentTab === 0 && isFetchingWaivers ? (
        <div className={classes.waiverContent}>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              className={classnames(classes.entry, classes.skeletonEntry)}
              key={index}
            >
              <Skeleton widthRandomness={0} width="100%" />
            </div>
          ))}
        </div>
      ) : fetchWaiversError ? (
        <Typography align="center">
          {fetchWaiversError.message
            ? fetchWaiversError.message
            : 'Oops, an error occurred!'}
        </Typography>
      ) : (
        <>
          <div className={classes.waiverContent}>
            {waivers.map((waiver) => (
              <div
                key={waiver.key}
                className={classnames(classes.entry, classes.pointer)}
                onClick={openWaiverExportPage(waiver.key)}
              >
                <Icon
                  name={ICONS.Waiver}
                  className={classes.entryIcon}
                  size="sm"
                />
                <span className={classes.entryContent}>{waiver.title}</span>
                <time className={classes.entryTime}>
                  {getDateAndTime(waiver.signedTimestamp)}
                </time>
                <div className={classes.entryButtons}>
                  <Tooltip title="request waiver">
                    <IconButton
                      className={classes.entryButton}
                      classes={{
                        label: classes.entryButtonIcon,
                      }}
                      onClick={requestWaiverRequesting(waiver.key)}
                    >
                      <Icon
                        name={ICONS.Request}
                        size="sm"
                        color="hoverLighten"
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="split">
                    <IconButton
                      className={classes.entryButton}
                      classes={{
                        label: classes.entryButtonIcon,
                      }}
                      onClick={handleOpenWaiverSplitter(
                        waiver.key,
                        waiver.title,
                      )}
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

          <div className={classes.makeRequestButtonWrapper}>
            <Button
              className={classes.makeRequestButton}
              variant="outlined"
              color="primary"
              onClick={requestMoreWaiverRequesting}
            >
              Create a request
            </Button>
          </div>
        </>
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
