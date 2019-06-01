import { useCallback, useEffect, useMemo } from 'react'
import createContainer from 'constate'
import { usePost } from '~src/hooks/useRequest'
import useLatest from '~src/hooks/useLatest'
import merge from 'ramda/es/merge'
import pick from 'ramda/es/pick'

import { getLoginParams, getIsAuthored, getFallbackUsername } from '~src/utils/qs3Login'

type AuthData = { id: string, username: string }

const getDefaultAuthData = (): AuthData => ({ id: '', username: '' })

const AccountContainer = createContainer(() => {
  const { data: authData, request: postAuthentication } = usePost<AuthData>()
  const { data: loginData, request: postLogin } = usePost<AuthData>()
  const { data: tmpLogoutData, request: postLogout } = usePost<{}>()
  const logoutData = useMemo<AuthData>(
    () => pick(['id', 'username'])(merge(getDefaultAuthData())(tmpLogoutData)),
    [tmpLogoutData],
  )

  const login = useCallback(() => postLogin('/api/auth/login')(getLoginParams()), [])
  const logout = useCallback(postLogout('/api/auth/invalidateToken'), [])

  const { id, username } = useLatest<AuthData | null>(authData, loginData, logoutData) || getDefaultAuthData()

  useEffect(() => { postAuthentication('/api/auth/authToken')() }, [])

  const authored = useMemo(() => !!username && getIsAuthored(), [username])

  const displayName = useMemo(() => username || getFallbackUsername(), [username])

  return {
    authored,
    id,
    username,
    login,
    logout,
  }
})

export default AccountContainer
