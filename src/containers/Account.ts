import { useCallback, useEffect, useMemo } from 'react'
import createContainer from 'constate'
import { usePost } from '~src/hooks/useRequest'
import useLatest from '~src/hooks/useLatest'
import pipe from 'ramda/es/pipe'
import head from 'ramda/es/head'
import merge from 'ramda/es/merge'
import defaultTo from 'ramda/es/defaultTo'
import pick from 'ramda/es/pick'

type AuthData = { id: string, username: string }

const getDefaultAuthData = (): AuthData => ({ id: '', username: '' })

const Account = createContainer(() => {
  const { data: authData, request: postAuthentication } = usePost<AuthData>()
  const { data: loginData, request: postLogin } = usePost<AuthData>()
  const { data: tmpLogoutData, request: postLogout } = usePost<{}>()
  const logoutData = useMemo<AuthData>(
    () => pick(['id', 'username'])(merge(getDefaultAuthData())(tmpLogoutData)),
    [tmpLogoutData],
  )

  const login = useCallback((email: string, password: string) => postLogin('/api/auth/login')({ email, password }), [])
  const logout = useCallback(postLogout('/api/auth/invalidateToken'), [])

  const { id, username } = useLatest<AuthData | null>(authData, loginData, logoutData) || getDefaultAuthData()

  useEffect(() => { postAuthentication('/api/auth/authToken')() }, [])

  return {
    authored: !!username,
    id,
    username,
    login,
    logout,
  }
})

export default Account
