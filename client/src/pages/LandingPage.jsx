import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectAuthUser } from '../redux/selectors/authSelectors'

const LandingPage = ({ user }) => {
  return (
    user ? <Redirect to='/dashboard' /> :
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to='/register' className='btn btn-primary'>Sign up</Link>
            <Link to='/login' className='btn btn-light'>Login</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectAuthUser
})
 
export default connect(mapStateToProps)(LandingPage)