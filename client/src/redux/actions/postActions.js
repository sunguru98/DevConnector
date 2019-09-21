import axios from 'axios'
import actionTypes from '../actionTypes'
import { alertUser } from '../actions/alertActions'
import { logoutUser } from '../actions/authActions'
const { SET_POST, SET_MULTI_POSTS, CLEAR_POST, SET_POST_ERROR } = actionTypes

export const getAllPosts = (accessToken, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_POST_LOADING', payload: false })
    const { data: {posts} } = await axios.get('/api/posts', configObj)
    dispatch({ type: SET_MULTI_POSTS, payload: posts })
    dispatch({ type: 'SET_POST_LOADING', payload: true })
  } catch(err) {
    if (err.response.data.statusCode === 401) return dispatch(logoutUser(accessToken, history))
    const errorMessage = err.response.data.message
    dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
  }
}

export const createPost = (accessToken, text, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken }}
  try {
    await axios.post('/api/posts', { text }, configObj)
    dispatch(getAllPosts(accessToken, history))
  } catch (err) {
    const errorMessage = err.response.data.message
    dispatch(alertUser({ message: errorMessage, alertType: 'danger' }))
    dispatch({ type: SET_POST_ERROR, payload: errorMessage })
  }
}
