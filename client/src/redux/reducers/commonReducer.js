import actionTypes from '../actionTypes'

const {SET_LOADING} = actionTypes

const initialState = {
  isLoading: false
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_LOADING: return { ...state, isLoading: payload }
    default: return state
  }
}