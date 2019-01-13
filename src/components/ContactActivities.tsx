import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Input from '@material-ui/core/Input'
import StepContent from '@material-ui/core/StepContent'
import AddCircle from '@material-ui/icons/AddCircle'
import CalendarToday from '@material-ui/icons/CalendarToday'
import SpeakerNotes from '@material-ui/icons/SpeakerNotes'
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import { Note } from '~src/types/Contact'

import NotificationContainer from '~src/containers/Notification'
import useContact from '~src/containers/useContact'
import getDate, { getTime } from '~src/utils/getDate'
import useToggle from '~src/hooks/useToggle'

const useStyles = makeStyles((theme: Theme) => ({
  headWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 2,
  },
  activityLabel: {
    'fontSize': theme.spacing.unit * 2,
    '&&': {
      fontWeight: 600,
    },
  },
  dot: {
    width: theme.spacing.unit,
    height: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 0 ${theme.spacing.unit * 0.5}px ${theme.spacing.unit * 0.25}px ${theme.palette.primary.light}`,
    borderRadius: '50%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 3,
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit,
  },
  entryContent: {
    position: 'relative',
    flex: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    padding: theme.spacing.unit,
    backgroundColor: theme.palette.grey['200'],
  },
  entryInputContent: {
    marginBottom: theme.spacing.unit,
  },
  noteSubmitter: {
    position: 'absolute',
    padding: 0,
    right: theme.spacing.unit,
    bottom: theme.spacing.unit,
  },
  entryTime: {
    width: 80,
    textAlign: 'right',
    fontSize: '0.75rem',
  },
  buttonWrapper: {
    textAlign: 'right',
  },
}))

export interface Props {
  contactId: string
}

const ContactActivities: React.FC<Props> = React.memo(({ contactId }) => {
  const classes = useStyles({})

  const { notify } = useContext(NotificationContainer.Context)

  const [notes, setNotes] = useState<Note[]>([])

  const {
    fetchNotes, fetchNotesError,
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

  useEffect(() => { freshNotes() }, [])

  useEffect(
    () => {
      fetchNotesError && notify(fetchNotesError.message)
    },
    [fetchNotesError],
  )
  useEffect(
    () => {
      addNoteError && notify(addNoteError.message)
    },
    [addNoteError],
  )
  // useEffect(
  //   () => {
  //     updateNoteError && notify(updateNoteError.message)
  //   },
  //   [updateNoteError],
  // )
  useEffect(
    () => {
      removeNoteError && notify(removeNoteError.message)
    },
    [removeNoteError],
  )

  const {value: showCtlBtns, toggleOn: toggleOnShowCtlBtns, toggleOff: toggleOffShowCtlBtns} = useToggle(false)
  // const {value: editActivity, toggle: toggleEditActivity, toggleOff: toggleOffEditActivity} = useToggle(false)
  const {value: showAddNote, toggleOn: toggleOnAddNote, toggleOff: toggleOffShowAddNote} = useToggle(false)

  const toggleShowButtons = useCallback(
    () => {
      if (showCtlBtns) {
        toggleOffShowAddNote()
        toggleOffShowCtlBtns()
      } else {
        toggleOffShowAddNote()
        toggleOnShowCtlBtns()
      }
    },
    [showCtlBtns],
  )

  const handleNoteUpdateByBlur = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value.trim()

      toggleOffShowAddNote()

      if (!value) return

      await addNote(value)
      await freshNotes()
    },
    [addNote],
  )
  const handleNoteUpdateByKeydown = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode !== 13) return
      const value = event.currentTarget.value.trim()

      toggleOffShowAddNote()

      if (!value) return

      await addNote(value)
      await freshNotes()
    },
    [addNote],
  )

  const NoteGroups = useMemo(
    () => {
      const sortedNotes = notes.slice()
        .sort((p, c) => p.timestamp - c.timestamp)
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

  return (
    <ContactTableThemeProvider>
      <div className={classes.headWrapper}>
        <Typography variant="h5">Activities</Typography>
        <Button
          variant="outlined"
          color="primary"
        >Manage</Button>
      </div>
      <Stepper orientation="vertical">
        {NoteGroups.map((group, gIndex) => (
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
              {!showAddNote && gIndex === 0 && (group.notes.length === 0) && (
                <div>Add Note for today!</div>
              )}
              {showAddNote && gIndex === 0 && (
                <div className={classnames(classes.entryContent, classes.entryInputContent)}>
                  <Input
                    placeholder="note"
                    disableUnderline
                    onBlur={handleNoteUpdateByBlur}
                    onKeyDown={handleNoteUpdateByKeydown}
                  />
                  <IconButton
                    color="primary"
                    className={classes.noteSubmitter}>
                    <PlayCircleFilled />
                  </IconButton>
                </div>
              )}
              {group.notes.map(note => (
                <div className={classes.entry} key={note.id}>
                  <div className={classes.entryContent}>
                    {note.content}
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
      <div className={classes.buttonWrapper}>
        {showCtlBtns && (
          <>
            <IconButton color="default">
              <CalendarToday />
            </IconButton>
            <IconButton color={showAddNote ? 'primary' : 'default'}>
              <SpeakerNotes onClick={toggleOnAddNote} />
            </IconButton>
          </>
        )}
        <IconButton color="primary">
          <AddCircle onClick={toggleShowButtons} />
        </IconButton>
      </div>
    </ContactTableThemeProvider>
  )
})

export default ContactActivities
