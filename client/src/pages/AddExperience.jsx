import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addProfileExperience } from '../redux/actions/profileActions'
import { selectAuthAccessToken } from '../redux/selectors/authSelectors'
import { selectProfileProfileLoading } from '../redux/selectors/profileSelectors'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import AlertList from '../components/AlertList'
import Spinner from '../components/Spinner'

const AddEducation = ({ addProfileExperience, profileLoading, accessToken, history }) => {
  const [formState, setFormState] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    current: false,
    to: '',
    description: ''
  })

  const handleSubmit = event => {
    event.preventDefault()
    addProfileExperience(accessToken, {...formState}, history)
  }

  const handleChange = event => setFormState({ ...formState, [event.target.name]: event.target.value })
  const { title, company, location, from, current, to, description } = formState
  
  return (
    !profileLoading ? <Spinner/> :
    <section className="container">
      <Helmet><title>DevConnector - Add Experience</title></Helmet>
      <AlertList />
      <h1 className="large text-primary">
       Add An Experience
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={ handleSubmit }>
        <div className="form-group">
          <input value={title} onChange={handleChange} type="text" placeholder="* Job Title" name="title" required />
        </div>
        <div className="form-group">
          <input value={company} onChange={ handleChange } type="text" placeholder="* Company" name="company" required />
        </div>
        <div className="form-group">
          <input value={location} onChange={ handleChange } type="text" placeholder="Location" name="location" />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input value={from} onChange={ handleChange } type="date" name="from" />
        </div>
         <div className="form-group">
          <p><input checked={current} onChange={ e => setFormState({...formState, current: e.target.checked }) } type="checkbox" name="current" value="" /> Current Job</p>
        </div>
        { !current && <div className="form-group">
          <h4>To Date</h4>
          <input value={to} onChange={ handleChange } type="date" name="to" />
        </div>}
        <div className="form-group">
          <textarea value={description} onChange={ handleChange }
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
    </section>
  )
}

AddEducation.propTypes = {
  addProfileExperience: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
  profileLoading: PropTypes.bool.isRequired
}

const mapStateToProps = createStructuredSelector({
  profileLoading: selectProfileProfileLoading,
  accessToken: selectAuthAccessToken
})

export default connect(mapStateToProps, { addProfileExperience })(AddEducation)
