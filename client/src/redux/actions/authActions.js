import actionTypes from '../actionTypes'
import { setLoading } from './commonActions'
import { alertUser } from './alertActions'
import axios from 'axios'

const { REGISTER_FAILURE, REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } = actionTypes

export const registerUser = ({ name, email, password }) => async dispatch => {
  const reqJSON = JSON.stringify({ name, email, password })
  try {
    dispatch(setLoading(true))
    const { data: { user, accessToken } } = await axios.post('/api/users', reqJSON, { headers: { 'Content-Type': 'application/json' } })
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    dispatch({ type: REGISTER_SUCCESS, payload: { user, accessToken } })
  } catch (err) {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    const errors = err.response.data.message
    errors.forEach(err => dispatch(alertUser({ message: err.msg, alertType: 'danger' })))
    dispatch({ type: REGISTER_FAILURE })
  } finally {
    dispatch(setLoading(false))
  }
}

export const loginUser = ({ email, password }) => async dispatch => {
  const reqJSON = JSON.stringify({ email, password })
  try {
    dispatch(setLoading(true))
    const { data: { user, accessToken } } = await axios.post('/api/auth', reqJSON, { headers: { 'Content-Type': 'application/json' } })
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    dispatch({ type: LOGIN_SUCCESS, payload: { user, accessToken } })
  } catch (err) {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    const errors = err.response.data.message
    if (typeof errors === Object) errors.forEach(err => dispatch(alertUser({ message: err.msg, alertType: 'danger' })))
    else dispatch(alertUser({ message: errors, alertType: 'danger' }))
    dispatch({ type: LOGIN_FAILURE })
  } finally {
    dispatch(setLoading(false))
  }
}

export const logoutUser = accessToken => async dispatch => {
  const configHeader = { headers: { 'Authorization': accessToken } }
  try {
    const response = await axios.delete('/api/auth', configHeader)
    console.log(response.data)
  } catch (err) {
    console.log(err.response.data)
  } finally {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    dispatch({ type: LOGOUT })
  }
}