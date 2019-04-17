import * as authApi from '../../apis/authentication'
import store from '../'
import { updateLoginStatus, clearLoginStatue } from './actions'

const dispatch = store.dispatch.bind(store)

export async function login(account: string, password: string) {
  const data = await authApi.login({ account, password })

  if (data.result) {
    const loginToken = data.token
    const loginTokenStorageKey = store.getState().system.loginTokenStorageKey
    localStorage.setItem(loginTokenStorageKey, loginToken)

    dispatch(updateLoginStatus({
      userId: data.user.id,
      userNickname: data.user.nickName,
      loginToken
    }))
  }

  return data
}

export async function certLoginToken() {
  const loginTokenStorageKey = store.getState().system.loginTokenStorageKey
  let loginToken = localStorage.getItem(loginTokenStorageKey)

  if (!loginToken) {
    return Promise.resolve()
  }

  const data = await authApi.certLoginToken(loginToken)
  if (!data) {
    localStorage.removeItem(loginTokenStorageKey)
    return Promise.resolve()
  }

  loginToken = data.token
  localStorage.setItem(loginTokenStorageKey, loginToken)

  dispatch(updateLoginStatus({
    userId: data.user.id,
    userNickname: data.user.nickName,
    loginToken
  }))
}

export function logout() {
  const loginTokenStorageKey = store.getState().system.loginTokenStorageKey

  localStorage.removeItem(loginTokenStorageKey)
  dispatch(clearLoginStatue())
}