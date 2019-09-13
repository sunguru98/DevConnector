import actionTypes from '../actionTypes'
const { SET_USER_PROFILE, SET_PROFILE_ERROR, SET_MULTI_PROFILES, CLEAR_PROFILE } = actionTypes

const initialState = {
  userProfile: JSON.parse(localStorage.getItem('profile')) || null,
  profileLoading: true,
  otherProfiles: [],
  profileError: null
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SET_PROFILE_LOADING': return { ...state, profileLoading: payload }
    case SET_USER_PROFILE: return { ...state, userProfile: payload }
    case SET_MULTI_PROFILES: return { ...state, otherProfiles: [...payload], profileLoading: false }
    case SET_PROFILE_ERROR: return { ...state, profileError: payload, profileLoading: false }
    case CLEAR_PROFILE: return { userProfile: null, otherProfiles: [], profileError: null, profileLoading: true }
    default: return state
  }
}