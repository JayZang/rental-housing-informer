/**
 * State
 */
export interface SystemState {
  loggedIn: boolean
  userId: string
  userNickname: string
  loginTimestamp: Date | null,
  loginToken: string
  loginTokenStorageKey: string
}

/**
 * Action
 */
export const UPDATE_LOGIN_STATUS = 'UPDATE_LOGIN_STATUS'

interface UpdateLoginStatusAction {
  type: typeof UPDATE_LOGIN_STATUS
  payload: {
    userId: string
    userNickname: string
    loginToken: string
  }
}

export type SystemActionTypes = UpdateLoginStatusAction