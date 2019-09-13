import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AlertList from '../components/AlertList'
import { connect } from 'react-redux'
import { loginUser } from '../redux/actions/authActions'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { selectAuthUser } from '../redux/selectors/authSelectors'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'


const LoginPage = ({ loginUser, history, user }) => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = event => {
    event.preventDefault()
    const { email, password } = formState
    loginUser({ email, password })
    if (!loginUser) setFormState({...formState, password: ''})
    else history.push('/dashboard')
  }

  const handleChange = event => setFormState({...formState, [event.target.name]: event.target.value })

  return (
    user !== null ? <Redirect to='/dashboard' /> :
    <section className="container">
      <Helmet><title>DevConnector - Login</title></Helmet>
      <AlertList />
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={ handleSubmit }>
        <div className="form-group">
          <input
            onChange={ handleChange }
            type="email"
            placeholder="Email Address"
            name="email"
            required
          />
        </div>
        <div className="form-group">
          <input
            onChange={ handleChange }
            type="password"
            placeholder="Password"
            name="password"
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </section>
  )
}

LoginPage.propTypes = {
  loginUser: PropTypes.func.isRequired
}

const mapStateToProps = createStructuredSelector({
  user: selectAuthUser
})
export default connect(mapStateToProps, { loginUser })(LoginPage)