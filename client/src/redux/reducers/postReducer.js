import actionTypes from '../actionTypes'

const { SET_POST, SET_MULTI_POSTS, CLEAR_POST, SET_POST_ERROR } = actionTypes

const initialState = {
  post: null,
  allPosts: [],
  postLoading: true,
  postError: null
}

export default (state = initialState, action) => {
  const { payload, type } = action
  switch (type) {
    case 'SET_POST_LOADING': return { ...state, postLoading: payload }
    case SET_POST: return { ...state, post: payload }
    case SET_MULTI_POSTS: return { ...state, allPosts: [...payload] }
    case SET_POST_ERROR: return { ...state, postError: payload, postLoading: false }
    case CLEAR_POST: return { post: null, allPosts: [], postLoading: true, postError: null }
    default: return state
  }
}
