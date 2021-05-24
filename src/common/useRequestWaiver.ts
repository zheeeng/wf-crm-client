import {
  RequestWaiverFormData,
  SendMoreWaiverFormData,
} from '@waiverforever/request-waiver-popup'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiClient } from '~src/utils/qs3Login'
import { useAlert } from '../containers/useAlert'
import { isEmail2 } from '../utils/validation'

export const useRequestWaiver = (onSuccess: () => void) => {
  const { fail } = useAlert()

  const [waiverId, setWaiverId] = useState('')
  const [waiverContent, setWaiverContent] =
    useState<{ id: string; templateId: string } | null>(null)

  useEffect(() => {
    if (waiverId && waiverId !== waiverContent?.id) {
      apiClient.get(`waiver/content/${waiverId}`).then((resp) => {
        if (resp.data.failed) throw new Error(resp.data.failed)
        // search()
        const { account } = resp.data.success.signed_doc

        setWaiverContent({ id: waiverId, templateId: account })
      })
    }
  }, [waiverContent?.id, waiverId])

  const [groupName, setGroupName] = useState('')
  const [initialRecipient, setInitialRecipient] = useState('')
  const [isCreateModalShow, setIsCreateModalShow] = useState(false)
  const [isMakNewRequest, setIsMakNewRequest] = useState(false)

  const setInvisible = useCallback(() => {
    setGroupName('')
    setWaiverId('')
    setInitialRecipient('')
    setIsCreateModalShow(false)
    setWaiverContent(null)
  }, [])

  const setVisible = useCallback(
    (recipient: string, waiverId: string, groupName: string) => {
      if (!isEmail2(recipient)) {
        fail('No valid email address found.')
        return
      }

      setWaiverId(waiverId)
      setGroupName(groupName)
      setInitialRecipient(recipient)
      setIsCreateModalShow(true)
      setIsMakNewRequest(false)
    },
    [fail],
  )

  const setRequestNewVisible = useCallback(
    (recipient: string) => {
      if (!isEmail2(recipient)) {
        fail('No valid email address found.')
        return
      }

      setWaiverId('')
      setInitialRecipient(recipient)
      setIsCreateModalShow(true)
      setIsMakNewRequest(true)
    },
    [fail],
  )

  const requestWaiverPopupProps = useMemo(
    () => ({
      requestVisible: isCreateModalShow && !isMakNewRequest,
      sendFromWaiverVisible: isCreateModalShow && isMakNewRequest,
      handleVisibleChange: setInvisible,
      initialRecipient,
      submitRequest: (data: RequestWaiverFormData) => {
        const { template_id: templateId } = data

        if (!templateId) throw new Error("Can't find template Id.")

        return apiClient
          .post('requestWaiver/createGroup', data, {
            'X-TEMPLATE-ID': templateId,
          })
          .then((resp) => {
            if (resp.data.failed) throw new Error(resp.data.failed)
            onSuccess()
            return resp.data.success.group_id
          })
      },
      submitRequestWithTemplate: (data: SendMoreWaiverFormData) => {
        if (!waiverContent || waiverContent.id !== waiverId)
          throw new Error("Can't find template Id.")

        const requestFormData = {
          ...data,
          groupName,
          groupSize: data.recipientList.split(';').length,
        }

        return apiClient
          .post('requestWaiver/createGroup', requestFormData, {
            'X-TEMPLATE-ID': waiverContent.templateId,
          })
          .then((resp) => {
            if (resp.data.failed) throw new Error(resp.data.failed)
            onSuccess()
            return resp.data.success.group_id
          })
      },
      sendEmailRequest: (email: string, displayName: string) =>
        apiClient
          .post('accountSettings/sendVerifyEmailRequest', {
            email: email,
            display_name: displayName,
          })
          .then((resp) => {
            if (resp.data.failed) throw new Error(resp.data.failed)
          }),
      getVerifiedEmails: () =>
        apiClient.get('accountSettings/getVerifiedEmails').then((resp) => {
          if (resp.data.failed) throw new Error(resp.data.failed)

          return resp.data.success.verifiedEmailAddresses as string[]
        }),
      verifyEmail: (email: string, code: string) =>
        apiClient
          .post('accountSettings/verifyEmail', {
            email,
            authCode: code,
          })
          .then((resp) => {
            if (resp.data.failed) throw new Error(resp.data.failed)
          }),
      getTemplates: isMakNewRequest
        ? () =>
            apiClient.get('waiverTemplate/getTemplates').then((resp) => {
              if (resp.data.failed) throw new Error(resp.data.failed)

              return resp.data.success as { id: string; title: string }[]
            })
        : undefined,
    }),
    [
      initialRecipient,
      isCreateModalShow,
      isMakNewRequest,
      setInvisible,
      waiverContent,
      waiverId,
      groupName,
      onSuccess,
    ],
  )

  return {
    setVisible,
    setRequestNewVisible,
    requestWaiverPopupProps,
  }
}
