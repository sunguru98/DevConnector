import { combineReducers } from 'redux'
import alertReducer from './alertReducer'
import authReducer from './authReducer'
import profileReducer from './profileReducer'

const rootReducer = combineReducers({
  alerts: alertReducer,
  auth: authReducer,
  profile: profileReducer
})

export default rootReducer