import React, { useCallback } from 'react'
import DialogModal from '~src/units/DialogModal'

import { useGroups } from '~src/containers/useGroups'

export interface Props {
  open: boolean
  onClose: () => void
  onOk?: (groupId: string) => Promise<any>
}

const RemoveContactsFromGroupForm: React.FC<Props> = React.memo(
  ({ open, onClose, onOk }) => {
    const { groupIdState } = useGroups()

    const handleOkClick = useCallback(async () => {
      onOk && (await onOk(groupIdState.value))
      onClose()
    }, [onOk, groupIdState.value, onClose])

    return (
      <DialogModal
        open={open}
        onClose={onClose}
        handleOkClick={handleOkClick}
        title="Remove contacts from group"
        content="Are you sure you want to remove the selected contacts from the current group?"
      />
    )
  },
)

export default RemoveContactsFromGroupForm
