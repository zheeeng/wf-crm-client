import { useState, useCallback } from 'react'
import createContainer from 'constate'

const WaiverSplitterContainer = createContainer(() => {
  const [toSplitWaiver, setToSplitWaiver] = useState({
    id: '',
    title: '',
  })

  const [splitMutation, setSplitMutation] = useState(0)

  const splitDone = useCallback(
    () => setSplitMutation(m => m + 1),
    [],
  )

  const readyToSplitWaiver = useCallback(
    (id: string, title: string) => setToSplitWaiver({ id, title }),
    [],
  )

  const cancelSplitWaiver = useCallback(
    () => setToSplitWaiver({ id: '', title: '' }),
    [],
  )

  return {
    toSplitWaiver,
    readyToSplitWaiver,
    cancelSplitWaiver,
    splitMutation,
    splitDone,
  }
})

export default WaiverSplitterContainer
