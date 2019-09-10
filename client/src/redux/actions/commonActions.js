import actionTypes from '../actionTypes'

const {SET_LOADING} = actionTypes

export const setLoading = loadingState => dispatch => {
  dispatch({type: SET_LOADING, payload: loadingState})
}