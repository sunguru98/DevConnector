import { combineReducers } from 'redux'
import alertReducer from './alertReducer'
import authReducer from './authReducer'
import profileReducer from './profileReducer'
import postReducer from './postReducer'

const rootReducer = combineReducers({
  alerts: alertReducer,
  auth: authReducer,
  profile: profileReducer,
  post: postReducer
})

export default rootReducer