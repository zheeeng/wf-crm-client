export default function createEventEntry () {
  let events: Array<() => void> = []

  const trigger = () => {
    events.forEach(event => event())
  }

  const clean = () => {
    events = []
  }

  return {
    subscribe (evt: () => void) {
      events.push(evt)

      return () => {
        events = events.filter(e => e !== evt)
      }
    },
    trigger,
    release () {
      trigger()
      clean()
    },
    clean,
  }
}
