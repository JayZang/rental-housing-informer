import { 
  UPDATE_LOGIN_STATUS,
  CLEAR_LOGIN_STATUS,
  SystemState,
  SystemActionTypes
} from './types'

const initState: SystemState = {
  loggedIn: false,
  user: {
    id: '',
    nickname: ''
  },
  loginToken: '',
  loginTokenStorageKey: 'dfg879dfgd',
  loginTimestamp: null
}

export function SystemReducer(state = initState, action: SystemActionTypes): SystemState {
  switch (action.type) {
    case UPDATE_LOGIN_STATUS:
      return {
        ...state,
        user: {
          id: action.payload.userId,
          nickname: action.payload.userNickname
        },
        loginToken: action.payload.loginToken,
        loggedIn: true,
        loginTimestamp: new Date()
      }

    case CLEAR_LOGIN_STATUS:
      return initState

    default: 
      return state
  }
}