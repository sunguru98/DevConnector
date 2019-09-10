import actionTypes from '../actionTypes'

const {ADD_ALERT, REMOVE_ALERT} = actionTypes
const initialState = []

const alertReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case ADD_ALERT: return [...state, payload]
    case REMOVE_ALERT: return state.filter(alert => alert.id !== payload)
    default: return state
  }
}

export default alertReducer