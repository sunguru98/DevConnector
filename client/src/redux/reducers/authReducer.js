import actionTypes from '../actionTypes'

const { REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT } = actionTypes
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS: return { ...state, user: payload.user, accessToken: payload.accessToken }
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case LOGOUT: return { ...state, user: null, accessToken: null }
    default: return state
  }
}