import actionTypes from '../actionTypes'
import axios from 'axios'
import { alertUser } from '../actions/alertActions'
import { logoutUser } from '../actions/authActions'
const { SET_USER_PROFILE, SET_PROFILE_ERROR, SET_MULTI_PROFILES, SET_GITHUB_REPOS, CLEAR_PROFILE } = actionTypes

export const getCurrentUserProfile = (accessToken, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    const { data: { profile } } = await axios.get('/api/profile/me', configObj)
    dispatch({ type: SET_USER_PROFILE, payload: profile })
    localStorage.setItem('profile', JSON.stringify(profile))
    dispatch({ type: 'SET_PROFILE_LOADING', payload: true })
  } catch (err) {
    console.log(err.response.data)
    if (err.response.data.statusCode === 401) dispatch(logoutUser(accessToken, history))
    else {
      const errors = err.response.data.message
      localStorage.removeItem('profile')
      dispatch({ type: SET_PROFILE_ERROR, payload: errors })
    }
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

export const deleteProfileAttribute = (accessToken, attrId, mode) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  try {
    dispatch({ type: 'SET_PROFILE_LOADING', payload: false })
    const {data: { profile }} = await axios.delete(`/api/profile/${mode === 'exp' ? 'experience' : 'education'}/${attrId}`, configObj)
    dispatch({ type: SET_USER_PROFILE, payload: profile })
    localStorage.setItem('profile', JSON.stringify(profile))
    dispatch(alertUser({ message: `${mode === 'exp' ? 'Experience' : 'Education'} removed successfully`, alertType: 'success' }))
  } catch (err) {
    const errors = err ? err.response.data.message : ''
    if (typeof errors !== String) errors.forEach(err => dispatch(alertUser({ message: err.msg, alertType: 'danger' })))
    else dispatch(alertUser({ message: errors, alertType: 'danger' }))   
    dispatch({ type: SET_PROFILE_ERROR, payload: errors })
  } finally { dispatch({ type: 'SET_PROFILE_LOADING', payload: true }) }
}

export const deleteProfile = (accessToken, history) => async dispatch => {
  const configObj = { headers: { 'Authorization': accessToken } }
  if (window.confirm('Are you sure to delete your profile ?')) {
    try {
      dispatch({ type: 'SET_PROFILE_LOADING', payload: false })
      await axios.delete(`/api/profile/`, configObj)
      localStorage.removeItem('profile')
      dispatch({ type: SET_USER_PROFILE, payload: null })
      history.push('/dashboard')
      dispatch(alertUser({ message: `Profile removed successfully`, alertType: 'success' }))
    } catch (err) {
      const errors = err ? err.response.data.message : ''
      if (typeof errors !== String) errors.forEach(err => dispatch(alertUser({ message: err.msg, alertType: 'danger' })))
      else dispatch(alertUser({ message: errors, alertType: 'danger' }))   
      dispatch({ type: SET_PROFILE_ERROR, payload: errors })
    } finally { dispatch({ type: 'SET_PROFILE_LOADING', payload: true }) }
  }
}

export const getAllProfiles = () => async dispatch => {
  try {
    dispatch({ type: 'SET_PROFILE_LOADING', payload: false })
    const { data: { profiles } } = await axios.get('/api/profile')
    dispatch({ type: SET_MULTI_PROFILES, payload: profiles })
    dispatch({ type: 'SET_PROFILE_LOADING', payload: true })
  } catch (err) {
    dispatch(alertUser({ message: err.response.data.message, alertType: 'danger' }))
  }
}

export const getProfileByUserId = userId => async dispatch => {
  try {
    dispatch({ type: CLEAR_PROFILE })
    dispatch({ type: 'SET_PROFILE_LOADING', payload: false })
    const { data: { profile } } = await axios.get(`/api/profile/user/${userId}`)
    dispatch({ type: SET_USER_PROFILE, payload: profile })
    dispatch({ type: 'SET_PROFILE_LOADING', payload: true })
    return profile
  } catch (err) {
    dispatch(alertUser({ message: err.response.data.message, alertType: 'danger' }))
  }
}

export const getGithubRepos = username => async dispatch => {
  try {
    dispatch({ type: 'SET_PROFILE_LOADING', payload: false })
    const { data: { repos } } = await axios.get(`/api/profile/github/${username}`)
    dispatch({ type: SET_GITHUB_REPOS, payload: repos })
    dispatch({ type: 'SET_PROFILE_LOADING', payload: true })
  } catch (err) {
    const message = err.response.status === 404 ? 'Github repos not found' : err.response.data.message
    dispatch(alertUser({ message, alertType: 'danger' }))
  }
}