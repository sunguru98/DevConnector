import actionTypes from '../actionTypes'

const { SET_POST, SET_MULTI_POSTS, CLEAR_POST, SET_POST_ERROR, REMOVE_POST, SET_POST_LIKE_STATE } = actionTypes

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
    case SET_POST_LIKE_STATE: return { ...state, allPosts: findPostAndLikeOrDislike(state.allPosts, payload) }
    case CLEAR_POST: return { post: null, allPosts: [], postLoading: true, postError: null }
    case REMOVE_POST: return { ...state, allPosts: state.allPosts.filter(post => post._id !== payload) }
    default: return state
  }
}

// Util functions
const findPostAndLikeOrDislike = (posts, { postId, mode, user: { name, _id, avatar } }) => {
  const likeObj = { user: _id, name, avatar }
  const allPosts = [...posts]
  const postIndex = allPosts.findIndex(post => post._id === postId)
  if (mode === 'like') allPosts[postIndex].likes.push(likeObj)
  else allPosts[postIndex].likes = allPosts[postIndex].likes.filter(like => like.user !== likeObj.user)
  allPosts[postIndex].isLiked = mode === 'like'
  return allPosts
}