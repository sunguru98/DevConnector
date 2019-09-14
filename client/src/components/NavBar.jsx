import React from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { logoutUser } from '../redux/actions/authActions'
import { selectAuthUser, selectAuthAccessToken } from '../redux/selectors/authSelectors'
import PropTypes from 'prop-types'

const NavBar = ({ user, accessToken, logoutUser, history }) => {
  
  const handleClick = () => {
    logoutUser(accessToken, history)
  }

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to='/'><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      { !user ? <ul>
        <li><NavLink to='/developers' activeClassName='active'>Developers</NavLink></li>
        <li><NavLink to='/register' activeClassName='active'>Register</NavLink></li>
        <li><NavLink to='/login' activeClassName='active'>Login</NavLink></li>
      </ul> : <ul>
        <li><NavLink to='/developers' activeClassName='active'>Developers</NavLink></li>
        <li> 
          <span onClick={ handleClick }>
            <i className="fas fa-sign-out-alt"></i>{' '} <span className="hide-sm">Logout</span>
          </span>
        </li>
      </ul> }
    </nav>
  )
}

NavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired
}
 
const mapStateToProps = createStructuredSelector({
  user: selectAuthUser,
  accessToken: selectAuthAccessToken
})

export default withRouter(connect(mapStateToProps, { logoutUser })(NavBar))