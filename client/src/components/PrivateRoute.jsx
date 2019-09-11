import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectAuthUser } from '../redux/selectors/authSelectors'

const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route {...rest} render={props => !user ? <Redirect to='/login'/> : <Component {...props} />} />
)

const mapStateToProps = createStructuredSelector({
  user: selectAuthUser
})

export default connect(mapStateToProps)(PrivateRoute)
