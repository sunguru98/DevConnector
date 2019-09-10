import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { alertUser } from '../redux/actions/alertActions'
import { registerUser } from '../redux/actions/authActions'
import PropTypes from 'prop-types'

import AlertList from '../components/AlertList'

const RegisterPage = ({ alertUser, registerUser }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    cPassword: ''
  })

  const handleSubmit = event => {
    const { password, cPassword, name, email } = formState
    event.preventDefault()
    if (password !== cPassword) {
      alertUser({message: 'Passwords do not match', alertType: 'danger' })
      setFormState({...formState, password: '', cPassword: ''})
    }
    else 
      registerUser({ name, email, password })
  }

  const handleChange = event => setFormState({...formState, [event.target.name]: event.target.value })

  return (
    <section className="container">
      <AlertList />
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input onChange={handleChange} type="text" placeholder="Name" name="name" required />
        </div>
        <div className="form-group">
          <input onChange={handleChange} type="email" placeholder="Email Address" name="email" />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
        </div>
        <div className="form-group">
          <input onChange={handleChange}
            type="password"
            placeholder="Password"
            name="password"
          />
        </div>
        <div className="form-group">
          <input onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
            name="cPassword"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </section>
  )
}

RegisterPage.propTypes = {
  alertUser: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired
}
 
export default connect(null, { alertUser, registerUser })(RegisterPage)