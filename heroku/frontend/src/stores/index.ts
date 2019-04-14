import { createStore, combineReducers } from 'redux'
import { SystemReducer } from './system/reducer'

const rootReducer = combineReducers({
  system: SystemReducer
})

export default createStore(rootReducer)

export type RootState = ReturnType<typeof rootReducer>