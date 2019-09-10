import { combineReducers } from 'redux'
import alertReducer from './alertReducer'
import authReducer from './authReducer'
import commonReducer from './commonReducer'

const rootReducer = combineReducers({
  alerts: alertReducer,
  auth: authReducer,
  common: commonReducer
})

export default rootReducer