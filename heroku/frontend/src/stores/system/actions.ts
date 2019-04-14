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