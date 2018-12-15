import { useState, useCallback, useEffect } from 'react'
import createContainer from 'constate'
import { usePost } from '~src/hooks/useRequest'
import useLatest from '~src/hooks/useLatest'
import useDepMemo from '~src/hooks/useDepMemo'
import pipe from 'ramda/src/pipe'
import head from 'ramda/src/head'
import merge from 'ramda/src/merge'
import defaultTo from 'ramda/src/defaultTo'
import pick from 'ramda/src/pick'

type AuthData = { id: string, username: string }

const getDefaultAuthData = (): AuthData => ({ id: '', username: '' })

const convertAuthData = pipe(
  head,
  defaultTo(getDefaultAuthData()),
  merge(getDefaultAuthData()),
  pick(['id', 'username']),
)

const Account = createContainer(() => {
  const { data: authData, request: postAuthentication } = usePost<AuthData>()
  const { data: loginData, request: postLogin } = usePost<AuthData>()
  const { data: tmpLogoutData, request: postLogout } = usePost<{}>()
  const logoutData = useDepMemo<AuthData>(convertAuthData, [tmpLogoutData])

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
