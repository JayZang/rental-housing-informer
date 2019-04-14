import { 
  UPDATE_LOGIN_STATUS,
  SystemState,
  SystemActionTypes
} from './types'

const initState: SystemState = {
  loggedIn: false,
  userId: '',
  userNickname: '',
  loginToken: '',
  loginTokenStorageKey: 'dfg879dfgd',
  loginTimestamp: null
}

export function SystemReducer(state = initState, action: SystemActionTypes): SystemState {
  switch (action.type) {
    case UPDATE_LOGIN_STATUS:
      return {
        ...state,
        ...action.payload,
        loggedIn: true,
        loginTimestamp: new Date()
      }
    default: 
      return state
  }
}