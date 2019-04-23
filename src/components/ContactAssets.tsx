import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'

import useToggle from '~src/hooks/useToggle'

import ExportContactsForm from '~src/components/ExportContactsForm'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import useContact from '~src/containers/useContact'
import WaiverSplitterContainer from '~src/containers/WaiverSplitter'
import { getDateAndTime } from '~src/utils/getDate'

import Icon, { ICONS } from '~src/units/Icons'
import Skeleton from 'react-skeleton-loader'

const useStyles = makeStyles((theme: Theme) => ({
  tabsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 4.5),
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
  uploadButton: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  entryIcon: {
    marginRight: theme.spacing(1),
  },
  entryContent: {
    flex: 1,
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    margin: theme.spacing(2),
  },
  popover: {
    pointerEvents: 'none',
  },
  popoverPaper: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
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
    (id: string, title: string) => () => readyToSplitWaiver(id, title),
    [],
  )

  const {
    value: exportContactsOpened,
    toggleOn: toggleOnExportContactsOpened,
    toggleOff: toggleOffExportContactsOpened,
  } = useToggle(false)

  const [popover, setPopover] = useState({
    anchorEl: null as HTMLElement | null,
    text: '',
  })

  const togglePopoverOpen = useCallback<{
    (opened: true, text: string): (event: React.MouseEvent<Element>) => void;
    (opened: false): (event: React.MouseEvent<Element>) => void;
  }> (
    (opened: boolean, text?: string) => (event: React.MouseEvent<Element>) => {
      const currentTarget = event.currentTarget as HTMLElement
      requestAnimationFrame(() => {
        setPopover({
          anchorEl: opened ? currentTarget : null,
          text: text || popover.text,
        })
      })
    },
    [popover],
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
        <div>
          {Array.from(({ length: 3 }), (_, index) => (
            <div className={classes.entry} key={index} >
              <Skeleton widthRandomness={0} />
            </div>
          ))}
        </div>
      )
      : fetchWaiversError
      ? (
        <Typography align="center">Oops, an error occurred!</Typography>
      )
      : (
        <div>
          {waivers.map(waiver => (
            <div key={waiver.id} className={classes.entry}>
              <Icon
                name={ICONS.Waiver}
                className={classes.entryIcon}
              />
              <span className={classes.entryContent}>{waiver.title}</span>
              <time className={classes.entryTime}>{getDateAndTime(waiver.signedTimestamp)}</time>
              <div className={classes.entryButtons}>
                <IconButton
                  className={classes.entryButton}
                  classes={{
                    label: classes.entryButtonIcon,
                  }}
                  onMouseEnter={togglePopoverOpen(true, 'split')}
                  onMouseLeave={togglePopoverOpen(false)}
                  onClick={handleOpenWaiverSplitter(waiver.id, waiver.title)}
                >
                  <Icon name={ICONS.Split} size="sm" color="hoverLighten" />
                </IconButton>
                <IconButton
                  className={classes.entryButton}
                  classes={{
                    label: classes.entryButtonIcon,
                  }}
                  onMouseEnter={togglePopoverOpen(true, 'export')}
                  onMouseLeave={togglePopoverOpen(false)}
                  onClick={toggleOnExportContactsOpened}
                >
                  <Icon name={ICONS.Download} size="sm" color="hoverLighten" />
                </IconButton>
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
      <Popover
        className={classes.popover}
        classes={{
          paper: classes.popoverPaper,
        }}
        open={!!popover.anchorEl}
        anchorEl={popover.anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={togglePopoverOpen(false)}
        disableRestoreFocus
      >
        <Typography>{popover.text}</Typography>
      </Popover>
    </ContactTableThemeProvider>
  )
})

export default ContactAssets
