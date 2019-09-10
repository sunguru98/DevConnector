import actionTypes from '../actionTypes'
import { setLoading } from './commonActions'
import { alertUser } from './alertActions'
import axios from 'axios'

const { REGISTER_FAILURE, REGISTER_SUCCESS } = actionTypes

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