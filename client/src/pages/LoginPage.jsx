import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = (props) => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = event => {
    event.preventDefault()
    console.log('Login form subitted')
  }

  const handleChange = event => setFormState({...formState, [event.target.name]: event.target.value })

  return (
    <section className="container">
      <div className="alert alert-danger">
        Invalid credentials
      </div>
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
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to='/login'>Sign Up</Link>
      </p>
    </section>
  )
}
 
export default LoginPage