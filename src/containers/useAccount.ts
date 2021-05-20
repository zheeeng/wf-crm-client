import { useCallback, useMemo } from 'react'
import useMount from 'react-use/lib/useMount'
import constate from 'constate'
import { usePost } from '~src/hooks/useRequest'
import useLatest from '~src/hooks/useLatest'

import { getLoginParams, getFallbackUsername } from '~src/utils/qs3Login'

type AuthData = { id: string; username: string }

const getDefaultAuthData = (): AuthData => ({ id: '', username: '' })

export const [UseAccountProvider, useAccount] = constate(() => {
  const { data: authData /* request: postAuthentication */ } =
    usePost<AuthData>()
  const { data: loginData, request: postLogin } = usePost<AuthData>()

  const login = useCallback(
    () => postLogin('/api/auth/login')(getLoginParams()),
    [postLogin],
  )

  const { id, username } =
    useLatest<AuthData | null>(authData, loginData) || getDefaultAuthData()

  useMount(login)

  const authored = useMemo(() => !!username, [username])

  const displayName = useMemo(
    () => username || getFallbackUsername(),
    [username],
  )

  return {
    authored,
    id,
    username: displayName,
    login,
  }
})
