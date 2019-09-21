import axios from 'axios'
import actionTypes from '../actionTypes'
import { alertUser } from '../actions/alertActions'
import { logoutUser } from '../actions/authActions'
const { SET_POST, SET_MULTI_POSTS, CLEAR_POST, SET_POST_ERROR, REMOVE_POST, SET_POST_LIKE_STATE } = actionTypes

export const getAllPosts = (accessToken, history, userId) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_POST_LOADING', payload: false })
    const { data: {posts} } = await axios.get('/api/posts', configObj)
    posts.forEach(post => post.isLiked = post.likes.find(like => like.user === userId) ? true : false)
    dispatch({ type: SET_MULTI_POSTS, payload: posts })
    dispatch({ type: 'SET_POST_LOADING', payload: true })
  } catch(err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
  }
}

export const getPostById = (accessToken, history, postId) => async dispatch => {
  const configObj = { headers: {'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_POST_LOADING', payload: false })
    dispatch({ type: CLEAR_POST })
    const { data: { post } } = await axios.get(`/api/posts/${postId}`, configObj)
    dispatch({ type: SET_POST, payload: post })
  } catch (err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
    dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
  } finally { dispatch({ type: 'SET_POST_LOADING', payload: true }) }
}

export const createPost = (accessToken, text, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken }}
  try {
    dispatch({ type: 'SET_POST_LOADING', payload: false })
    await axios.post('/api/posts', { text }, configObj)
    dispatch(getAllPosts(accessToken, history))
    dispatch(alertUser({ message: 'Post created successfully', alertType: 'success' }))
  } catch (err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    if (typeof errorMessage !== String) 
      errorMessage.forEach(message => dispatch(alertUser({ message: message.msg, alertType: 'danger' })))
    else
      dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
  } finally { dispatch({ type: 'SET_POST_LOADING', payload: true }) }
}

export const deletePostById = (accessToken, postId, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_POST_LOADING', payload: false })
    await axios.delete(`/api/posts/${postId}`, configObj)
    dispatch({ type: REMOVE_POST, payload: postId })
    dispatch(alertUser({ message: 'Post removed successfully', alertType: 'success' }))
  } catch (err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
  } finally { dispatch({ type: 'SET_POST_LOADING', payload: true }) }
}

export const likePostById = (accessToken, postId, user, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: SET_POST_LIKE_STATE, payload: { postId, mode: 'like', user } })
    await axios.put(`/api/posts/like/${postId}`, null, configObj)
  } catch (err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
    dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
  }
}

export const dislikePostById = (accessToken, postId, user, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken }}
  try {
    dispatch({ type: SET_POST_LIKE_STATE, payload: { postId, mode: 'dislike', user } })
    await axios.delete(`/api/posts/like/${postId}`, configObj)
  } catch (err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
    dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))  
  }
}

export const postComment = (accessToken, history, postId, text) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken }}
  try {
    dispatch({ type: 'SET_POST_LOADING', payload: false })
    const { data: { post } } = await axios.put(`/api/posts/comment/${postId}`, { text }, configObj)
    dispatch({ type: SET_POST, payload: post })
    dispatch(alertUser({ message: 'Comment added successfully', alertType: 'success' }))
  } catch (err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    if (typeof errorMessage !== String) 
      errorMessage.forEach(message => dispatch(alertUser({ message: message.msg, alertType: 'danger' })))
    else
      dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
  } finally { dispatch({ type: 'SET_POST_LOADING', payload: true })}
}

export const deleteComment = (accessToken, history, commentId, postId) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_POST_LOADING', payload: false })
    const { data: { post } } = await axios.delete(`/api/posts/comment/${postId}/${commentId}`, configObj)
    dispatch({ type: SET_POST, payload: post })
    dispatch(alertUser({ message: 'Comment deleted succesfully', alertType: 'success' }))
  } catch (err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
  } finally { dispatch({ type: 'SET_POST_LOADING', payload: true }) }
}
