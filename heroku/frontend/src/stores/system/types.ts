/**
 * State
 */
export interface IUser {
  id: string
  nickname: string
}

export interface SystemState {
  loggedIn: boolean
  user: IUser,
  loginTimestamp: Date | null,
  loginToken: string
  loginTokenStorageKey: string
}

/**
 * Action
 */
export const UPDATE_LOGIN_STATUS = 'UPDATE_LOGIN_STATUS'
export const CLEAR_LOGIN_STATUS = 'CLEAR_LOGIN_STATUS'

interface UpdateLoginStatusAction {
  type: typeof UPDATE_LOGIN_STATUS
  payload: {
    userId: string
    userNickname: string
    loginToken: string
  }
}

interface ClearLoginStatusAction {
  type: typeof CLEAR_LOGIN_STATUS
}

export type SystemActionTypes = UpdateLoginStatusAction | ClearLoginStatusAction