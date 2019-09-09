import rootReducer from './reducers/rootReducer'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import logger from 'redux-logger'


const middlewares = [thunk, logger]
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

export default store