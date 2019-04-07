import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react'
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

import { Note } from '~src/types/Contact'
import ContactTableThemeProvider from '~src/theme/ContactTableThemeProvider'
import AlertContainer from '~src/containers/Alert'
import useContact from '~src/containers/useContact'
import getDate, { getTime } from '~src/utils/getDate'
import useToggle from '~src/hooks/useToggle'

import Icon, { ICONS } from '~src/units/Icons'
import ProgressLoading from '~src/units/ProgressLoading'

const useStyles = makeStyles((theme: Theme) => ({
  headWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing.unit * 4}px`,
    marginBottom: theme.spacing.unit * 2,
  },
  title: {
    color: theme.palette.grey[800],
    fontSize: 20,
  },
  manageButton: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
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
    ...{
      '&:hover': {
        backgroundColor: theme.palette.grey['200'],
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
    padding: `0 ${theme.spacing.unit * 4}px`,
  },
  entryInputContent: {
    marginBottom: theme.spacing.unit,
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
    right: theme.spacing.unit / 2,
    bottom: theme.spacing.unit / 2,
  },
  noteRemover: {
    position: 'absolute',
    padding: 0,
    right: theme.spacing.unit,
    bottom: theme.spacing.unit * 1.5,
    visibility: 'hidden',
    width: theme.spacing.unit * 2,
    height: theme.spacing.unit * 2,
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
    color: theme.palette.text.hint,
    whiteSpace: 'nowrap',
  },
  buttonWrapper: {
    padding: `0 ${theme.spacing.unit * 4}px`,
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
    margin: theme.spacing.unit * 2,
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
    () => {
      addNoteError && fail(addNoteError.message)
    },
    [addNoteError],
  )
  // useEffect(
  //   () => {
  //     updateNoteError && fail(updateNoteError.message)
  //   },
  //   [updateNoteError],
  // )
  useEffect(
    () => {
      removeNoteError && fail(removeNoteError.message)
    },
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
    [showCtlButtons],
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
      if (event.keyCode !== 13 || !event.metaKey) return
      event.preventDefault()
      const value = event.currentTarget.value.trim()

      toggleOffShowAddNote()

      if (!value) return

      await addNote(value)
      await freshNotes()
    },
    [addNote],
  )

  const handleNoteRemove = useCallback(
    (id: string) =>
      async () => {
        await removeNote(id)
        await freshNotes()
      },
    [],
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
        <div className={classes.progressWrapper}>
          <ProgressLoading className={classes.progress} size={64} />
        </div>
      )
      : !!fetchNotesError
      ? (
        <Typography align="center">Oops, an error occurred!</Typography>
      )
      : (
        <Stepper orientation="vertical" className={classes.stepper}>
          {NoteGroups.map((group, gIndex) => (
            <Step
              key={group.date}
              active
            >
              <StepLabel
                classes={{
                  label: classes.activityLabel,
                }}
                icon={<div className={classes.dot} />}
              >
                {group.date}
              </StepLabel>
              <StepContent>
                {!showAddNote && !loading.show && loading.triggered && gIndex === 0 && (group.notes.length === 0) && (
                  <div>Add Note for today!</div>
                )}
                {showAddNote && gIndex === 0 && (
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
                    />
                    <IconButton
                      color="primary"
                      className={classes.noteSubmitter}
                    >
                      <Icon name={ICONS.Enter} />
                    </IconButton>
                  </div>
                )}
                {group.notes.map(note => (
                  <div className={classes.entry} key={note.id}>
                    <div className={classes.entryContent}>
                      {note.content}
                      <IconButton
                        className={classes.noteRemover}
                        onClick={handleNoteRemove(note.id)}
                      >
                        <Icon name={ICONS.Delete} />
                      </IconButton>
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
          {showCtlButtons && (
            <>
              {/* <IconButton
                classes={{
                  label: classes.entryButtonIcon,
                }}
              >
                <Icon name={ICONS.Birthday} />
              </IconButton> */}
              <IconButton
                classes={{
                  label: classes.entryButtonIcon,
                }}
                onClick={toggleOnAddNote}
              >
                <Icon name={ICONS.Note} color={showAddNote ? 'primary' : 'hoverLighten'} />
              </IconButton>
            </>
          )}
          <IconButton color="primary" onClick={toggleShowButtons}>
            <Icon name={ICONS.AddCircle} />
          </IconButton>
        </div>
      )}
    </ContactTableThemeProvider>
  )
})

export default ContactActivities
