import { SystemActionTypes, UPDATE_LOGIN_STATUS } from './types'

export function updateLoginStatus(payload: {
  userId: string, 
  userNickname: string,
  loginToken: string
}): SystemActionTypes {
  return {
    type: UPDATE_LOGIN_STATUS,
    payload
  }
}

export function clearLoginStatue(): SystemActionTypes {
  return {
    type: 'CLEAR_LOGIN_STATUS'
  }
}