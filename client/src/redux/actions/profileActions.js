import actionTypes from '../actionTypes'
import axios from 'axios'
import { alertUser } from '../actions/alertActions'
const { SET_USER_PROFILE, SET_PROFILE_ERROR } = actionTypes

export const getCurrentUserProfile = accessToken => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    const { data: { profile } } = await axios.get('/api/profile/me', configObj)
    dispatch({ type: SET_USER_PROFILE, payload: profile })
    localStorage.setItem('profile', JSON.stringify(profile))
  } catch (err) {
    const errors = err.response.data.message
    localStorage.removeItem('profile')
    dispatch({ type: SET_PROFILE_ERROR, payload: errors })
  }
}

export const createProfile = (history, profileObj, accessToken, editMode = false) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_PROFILE_LOADING', payload: false })
    await axios.post('/api/profile', profileObj, configObj)
    history.push('/dashboard')
    dispatch(alertUser({ message: `User ${editMode ? 'edited' : 'created'} successfully`, alertType: 'success' }))
  } catch (err) {
    const errors = err ? err.response.data.message : ''
    if (typeof errors !== String) errors.forEach(err => dispatch(alertUser({ message: err.msg, alertType: 'danger' })))
    else dispatch(alertUser({ message: errors, alertType: 'danger' }))   
    dispatch({ type: SET_PROFILE_ERROR, payload: errors })
  } finally { dispatch({ type: 'SET_PROFILE_LOADING', payload: true }) }
}

export const addProfileEducation = (accessToken, educationObj, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_PROFILE_LOADING', payload: false })
    await axios.put('/api/profile/education', educationObj, configObj)
    history.push('/dashboard')
    dispatch(alertUser({ message: 'Education added successfully', alertType: 'success' }))
  } catch (err) {
    const errors = err ? err.response.data.message : ''
    if (typeof errors !== String) errors.forEach(err => dispatch(alertUser({ message: err.msg, alertType: 'danger' })))
    else dispatch(alertUser({ message: errors, alertType: 'danger' }))   
    dispatch({ type: SET_PROFILE_ERROR, payload: errors })
  } finally { dispatch({ type: 'SET_PROFILE_LOADING', payload: true }) }
}

export const addProfileExperience = (accessToken, experienceObj, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_PROFILE_LOADING', payload: false })
    await axios.put('/api/profile/experience', experienceObj, configObj)
    history.push('/dashboard')
    dispatch(alertUser({ message: 'Experience added successfully', alertType: 'success' }))
  } catch (err) {
    const errors = err ? err.response.data.message : ''
    if (typeof errors !== String) errors.forEach(err => dispatch(alertUser({ message: err.msg, alertType: 'danger' })))
    else dispatch(alertUser({ message: errors, alertType: 'danger' }))   
    dispatch({ type: SET_PROFILE_ERROR, payload: errors })
  } finally { dispatch({ type: 'SET_PROFILE_LOADING', payload: true }) }
}