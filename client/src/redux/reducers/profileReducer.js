import actionTypes from '../actionTypes'
const { SET_USER_PROFILE, SET_PROFILE_ERROR, SET_MULTI_PROFILES, CLEAR_PROFILE, SET_GITHUB_REPOS } = actionTypes

const initialState = {
  userProfile: JSON.parse(localStorage.getItem('profile')) || null,
  profileLoading: true,
  allProfiles: [],
  profileError: null,
  githubRepos: []
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SET_PROFILE_LOADING': return { ...state, profileLoading: payload }
    case SET_GITHUB_REPOS: return { ...state, githubRepos: payload }
    case SET_USER_PROFILE: return { ...state, userProfile: payload }
    case SET_MULTI_PROFILES: return { ...state, allProfiles: [...payload] }
    case SET_PROFILE_ERROR: return { ...state, profileError: payload, profileLoading: false }
    case CLEAR_PROFILE: localStorage.removeItem('profile'); return { userProfile: null, allProfiles: [], profileError: null, profileLoading: true, githubRepos: [] }
    default: return state
  }
}