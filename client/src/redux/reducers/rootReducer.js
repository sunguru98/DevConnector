import { combineReducers } from 'redux'
import alertReducer from './alertReducer'
import authReducer from './authReducer'
import commonReducer from './commonReducer'
import profileReducer from './profileReducer'

const rootReducer = combineReducers({
  alerts: alertReducer,
  auth: authReducer,
  common: commonReducer,
  profile: profileReducer
})

export default rootReducer