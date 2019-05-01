import React, { useState, useCallback, useEffect, useContext, useRef, useMemo } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Input from '@material-ui/core/Input'
import StepContent from '@material-ui/core/StepContent'
import Tooltip from '@material-ui/core/Tooltip'

import { Note } from '~src/types/Contact'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import AlertContainer from '~src/containers/Alert'
import useContact from '~src/containers/useContact'
import getDate, { getTime } from '~src/utils/getDate'
import useToggle from '~src/hooks/useToggle'

import Icon, { ICONS } from '~src/units/Icons'
import Skeleton from 'react-skeleton-loader'

const useStyles = makeStyles((theme: Theme) => ({
  headWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(4)}px`,
    marginBottom: theme.spacing(2),
  },
  title: {
    color: theme.palette.grey[800],
    fontSize: 20,
  },
  manageButton: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  activityLabel: {
    'fontSize': theme.spacing(2),
    '&&': {
      fontWeight: 600,
    },
  },
  dot: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 0 0px 4px rgba(179, 199, 244, 1)',
    zIndex: 1,
    borderRadius: '50%',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3),
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  noteForToday: {
    color: theme.palette.primary.main,
    margin: theme.spacing(1, 0, 2),
    fontSize: 16,
  },
  entryContent: {
    position: 'relative',
    flex: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    padding: theme.spacing(0.5, 3, 0.5, 1),
    ...{
      '&:hover': {
        backgroundColor: theme.palette.grey['900'],
      }
    },
  },
  entryInput: {
    width: '100%',
  },
  entryInputRoot: {
    color: theme.palette.text.secondary,
  },
  stepper: {
    padding: `0 ${theme.spacing(4)}px`,
  },
  skeletonContent: {
    margin: theme.spacing(1, 0, 0, 1.5),
    padding: theme.spacing(1),
  },
  entryInputContent: {
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.grey['200'],
  },
  entryButtonIcon: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  noteSubmitter: {
    position: 'absolute',
    padding: 0,
    right: theme.spacing(0.5),
    bottom: theme.spacing(0.5),
  },
  noteRemover: {
    position: 'absolute',
    padding: 0,
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    visibility: 'hidden',
    width: theme.spacing(2),
    height: theme.spacing(2),
    color: theme.palette.text.hint,
    ...{
      '&:hover': {
        color: theme.palette.primary.main,
      },
      '$entryContent:hover &': {
        visibility: 'visible',
      },
    },
  },
  entryTime: {
    width: 80,
    textAlign: 'right',
    fontSize: '0.75rem',
    color: theme.palette.grey[800],
    whiteSpace: 'nowrap',
  },
  buttonWrapper: {
    padding: `0 ${theme.spacing(4)}px`,
    textAlign: 'right',
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
}))

export interface Props {
  contactId: string
}

const ContactActivities: React.FC<Props> = React.memo(({ contactId }) => {
  const classes = useStyles({})

  const { fail } = useContext(AlertContainer.Context)

  const [ notes, setNotes ] = useState<Note[]>([])

  const {
    fetchNotes, isFetchingNotes, fetchNotesError,
    addNote, addNoteError,
    // updateNote, updateNoteError,
    removeNote, removeNoteError,
   } = useContact(contactId)

  const freshNotes = useCallback(
    async () => {
      const ns = await fetchNotes()
      const sortedNs = ns.sort((p, c) => c.timestamp - p.timestamp)
      setNotes(sortedNs)
    },
    [],
  )

  useEffect(() => { freshNotes() }, [contactId])

  useEffect(
    () => { addNoteError && fail(addNoteError.message) },
    [addNoteError],
  )
  // useEffect(
  //   () => { updateNoteError && fail(updateNoteError.message) },
  //   [updateNoteError],
  // )
  useEffect(
    () => { removeNoteError && fail(removeNoteError.message) },
    [removeNoteError],
  )

  const {value: showCtlButtons, toggleOn: toggleOnShowCtlButtons, toggleOff: toggleOffShowCtlButtons} = useToggle(false)
  // const {value: editActivity, toggle: toggleEditActivity, toggleOff: toggleOffEditActivity} = useToggle(false)
  const {value: showAddNote, toggleOn: toggleOnAddNote, toggleOff: toggleOffShowAddNote} = useToggle(false)

  const toggleShowButtons = useCallback(
    () => {
      if (showCtlButtons) {
        toggleOffShowAddNote()
        toggleOffShowCtlButtons()
      } else {
        toggleOffShowAddNote()
        toggleOnShowCtlButtons()
      }
    },
    [toggleOffShowAddNote, showCtlButtons],
  )

  const inputtingNoteRef = useRef('')

  const handleNoteUpdateByBlur = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      inputtingNoteRef.current = event.target.value
    },
    [],
  )

  const handleSubmitUpdate = useCallback(
    async () => {
      const value = inputtingNoteRef.current.trim()

      toggleOffShowAddNote()

      if (!value) return

      await addNote(value)
      await freshNotes()
    },
    [addNote, freshNotes, toggleOffShowAddNote],
  )

  const handleNoteUpdateByKeydown = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {

      if (event.keyCode === 27) {
        toggleOffShowAddNote()
        return
      }

      if (event.keyCode !== 13 || !event.metaKey) return
      event.preventDefault()

      const value = event.currentTarget.value.trim()

      toggleOffShowAddNote()

      if (!value) return

      await addNote(value)
      await freshNotes()
    },
    [addNote, freshNotes, toggleOffShowAddNote],
  )

  const handleNoteRemove = useCallback(
    (id: string) =>
      async () => {
        await removeNote(id)
        await freshNotes()
      },
    [removeNote, freshNotes],
  )

  const noteGroups = useMemo(
    () => {
      const sortedNotes = notes.slice()
        .sort((p, c) => c.timestamp - p.timestamp)
        .map(note => ({ ...note, date: getDate(note.timestamp)}))

      const groupedMap = sortedNotes.reduce<{ [key: string]: Note[] }>(
        (m, note) => {
          const date = getDate(note.timestamp)
          m[date] = m[date] ? [...m[date], note] : [note]

          return m
        },
        {[getDate(+new Date())]: []},
      )

      return Object.keys(groupedMap).map(key => ({
        date: key,
        notes: groupedMap[key],
      }))
    },
    [notes],
  )

  const [loading, setLoading] = useState({ show: false, triggered: false })

  useEffect(
    () => {
      if (!loading.show && !loading.triggered && isFetchingNotes) {
        setLoading({ show: true, triggered: true })
      } else if (loading.show && !isFetchingNotes) {
        setLoading({ ...loading, show: false })
      }
    },
    [loading, isFetchingNotes],
  )

  const isLoading = useMemo(
    () => !showAddNote && !loading.show && loading.triggered,
    [showAddNote, loading],
  )

  return (
    <ContactTableThemeProvider>
      <div className={classes.headWrapper}>
        {/* <Typography variant="h4" className={classes.title}>Activities</Typography> */}
        <Typography variant="h4" className={classes.title}>Notes</Typography>
        {/* <Button
          className={classes.manageButton}
          variant="outlined"
          color="primary"
        >Manage</Button> */}
      </div>
      {loading.show
      ? (
        <div className={classes.stepper}>
          {Array.from(({ length: 5 }), (_, index) => (
            <div key={index} className={classes.skeletonContent}>
              <Skeleton widthRandomness={0} width="100%"/>
            </div>
          ))}
        </div>
      )
      : !!fetchNotesError
      ? (
        <Typography align="center">
          Oops, an error occurred!
        </Typography>
      )
      : (
        <Stepper orientation="vertical" className={classes.stepper}>
          {noteGroups.map((group, gIndex) => (
            <Step key={group.date} active>
              <StepLabel
                classes={{
                  label: classes.activityLabel,
                }}
                icon={<div className={classes.dot} />}
                >
                {group.date}
              </StepLabel>
              <StepContent>
                {isLoading && gIndex === 0 && group.notes.length === 0 && (
                  <div className={classes.noteForToday} onClick={toggleOnAddNote}>Add Note for today!</div>
                )}
                {showAddNote
                  && gIndex === 0
                  && (
                    <div className={classnames(classes.entryContent, classes.entryInputContent)}>
                      <Input
                        className={classes.entryInput}
                        classes={{ root: classes.entryInputRoot }}
                        placeholder="Click to add notes..."
                        disableUnderline
                        multiline
                        rowsMax={4}
                        onBlur={handleNoteUpdateByBlur}
                        onKeyDown={handleNoteUpdateByKeydown}
                        autoFocus
                      />
                      <Tooltip title="submit">
                        <IconButton color="primary" className={classes.noteSubmitter} onClick={handleSubmitUpdate}>
                          <Icon name={ICONS.Enter} color={'hoverLighten'}/>
                        </IconButton>
                      </Tooltip>
                    </div>
                  )
                }
                {group.notes.map(note => (
                  <div className={classes.entry} key={note.id}>
                    <div className={classes.entryContent}>
                      {note.content}
                      <Tooltip title="remove">
                        <IconButton className={classes.noteRemover} onClick={handleNoteRemove(note.id)}>
                          <Icon name={ICONS.Delete} color={'hoverLighten'}/>
                        </IconButton>
                      </Tooltip>
                    </div>
                    <time className={classes.entryTime}>
                      {getTime(note.timestamp)}
                    </time>
                  </div>
                ))}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      )}
      {!loading.show && !fetchNotesError &&
        (<div className={classes.buttonWrapper}>
          {false && showCtlButtons && (
            <>
              {/* <IconButton
                classes={{
                  label: classes.entryButtonIcon,
                }}
              >
                <Icon name={ICONS.Birthday} />
              </IconButton> */}
              <Tooltip title="add note">
                <IconButton classes={{ label: classes.entryButtonIcon }} onClick={toggleOnAddNote}>
                  <Icon name={ICONS.Note} color={showAddNote ? 'primary' : 'hoverLighten'} />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="note">
            <IconButton color="primary" onClick={toggleOnAddNote}
              // onClick={toggleShowButtons}
            >
              <Icon name={ICONS.AddCircle} />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </ContactTableThemeProvider>
  )
})

export default ContactActivities
