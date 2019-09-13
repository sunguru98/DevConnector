import actionTypes from '../actionTypes'
import uuid from 'uuid/v4'

const { ADD_ALERT, REMOVE_ALERT } = actionTypes

export const alertUser = ({ message, alertType }) => dispatch => {
    console.log(message)
    const id = uuid()
    dispatch({
        type: ADD_ALERT,
        payload: { message, alertType, id }
    })
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 2000)
}