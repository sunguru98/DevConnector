import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addProfileEducation } from '../redux/actions/profileActions'
import { selectAuthAccessToken } from '../redux/selectors/authSelectors'
import { selectProfileProfileLoading } from '../redux/selectors/profileSelectors'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import AlertList from '../components/AlertList'
import Spinner from '../components/Spinner'

const AddEducation = ({ addProfileEducation, profileLoading, accessToken, history }) => {
  const [formState, setFormState] = useState({
    school: '',
    degree: '',
    from: '',
    current: false,
    to: '',
    fieldOfStudy: '',
    description: ''
  })

  const handleSubmit = event => {
    event.preventDefault()
    addProfileEducation(accessToken, {...formState}, history)
  }

  const handleChange = event => setFormState({ ...formState, [event.target.name]: event.target.value })
  const { school, degree, from, fieldOfStudy, current, to, description } = formState
  return (
    !profileLoading ? <Spinner/> :
    <section className="container">
      <Helmet><title>DevConnector - Add Education</title></Helmet>
      <AlertList />
      <h1 className="large text-primary">
        Add Your Education
      </h1>
      <p className="lead">
        <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
        you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input value={school} onChange={ handleChange }
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            required
          />
        </div>
        <div className="form-group">
          <input value={degree} onChange={ handleChange }
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            required
          />
        </div>
        <div className="form-group">
          <input value={fieldOfStudy} onChange={ handleChange } type="text" placeholder="Field Of Study" name="fieldOfStudy" />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input value={from} onChange={ handleChange } type="date" name="from" />
        </div>
        <div className="form-group">
          <p>
            <input checked={current} onChange={ e => setFormState({...formState, current: e.target.checked }) } type="checkbox" name="current" /> Currently Pursuing
          </p>
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
            placeholder="Program Description"
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
    </section>
  )
}

AddEducation.propTypes = {
  addProfileEducation: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
  profileLoading: PropTypes.bool.isRequired
}

const mapStateToProps = createStructuredSelector({
  profileLoading: selectProfileProfileLoading,
  accessToken: selectAuthAccessToken
})

export default connect(mapStateToProps, { addProfileEducation })(AddEducation)
