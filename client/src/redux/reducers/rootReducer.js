import { combineReducers } from 'redux'

const alertReducer = require('./alertReducer')

const rootReducer = combineReducers({
  alerts: alertReducer
})

export default rootReducer