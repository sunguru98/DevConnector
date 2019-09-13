import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../components/Spinner'
import AlertList from '../components/AlertList'
import { connect } from 'react-redux'
import { selectAuthAccessToken } from '../redux/selectors/authSelectors'
import { createProfile } from '../redux/actions/profileActions'
import { createStructuredSelector } from 'reselect'
import { selectProfileUserProfile, selectProfileProfileLoading } from '../redux/selectors/profileSelectors'
import { Redirect } from 'react-router-dom'

const CreateProfilePage = ({ accessToken, createProfile, history, match: { path }, profile, profileLoading }) => {
  const [formData, setFormData] = useState(path === '/create-profile' ? {
    company: '', website: '', location: '', bio: '', position: '', githubUserName: '', skills: '', 
      youtube: '', facebook: '', twitter: '', instagram: '', linkedIn: ''
  } : {...profile})

  const [socialNetworkState, setSocialNetworkState] = useState(false)

  const { company, website, location, bio, position, githubUserName, skills, 
    youtube, facebook, twitter, instagram, linkedIn } = formData

  const handleChange = event => setFormData({ ...formData, [event.target.name]: event.target.value })
  const handleSubmit = event => {
    event.preventDefault()
    createProfile(history, formData, accessToken, true)
  }

  return (
    profile && path === '/create-profile' ? <Redirect to='/dashboard' /> :
    profile && !profileLoading ? <Spinner/> :
    <section className='container'>
      <AlertList />
      <h1 className="large text-primary">
        { path === '/create-profile' ? 'Create Your Profile' : 'Edit Your Profile' }
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={ handleSubmit }>
        <div className="form-group">
          <select value={position} onChange={ handleChange } name="position">
            <option value="">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">Give us an idea of where you are at in your career</small>
        </div>
        <div className="form-group">
          <input value={company} onChange={ handleChange } type="text" placeholder="Company" name="company" />
          <small className="form-text">Could be your own company or one you work for</small>
        </div>
        <div className="form-group">
          <input value={website} onChange={ handleChange } type="text" placeholder="Website" name="website" />
          <small className="form-text">Could be your own or a company website</small>
        </div>
        <div className="form-group">
          <input value={location} onChange={ handleChange } type="text" placeholder="Location" name="location" />
          <small className="form-text">City & state suggested (eg. Boston, MA)</small>
        </div>
        <div className="form-group">
          <input value={skills} onChange={ handleChange } type="text" placeholder="* Skills" name="skills" />
          <small className="form-text">Please use comma separated values (eg.
            HTML,CSS,JavaScript,PHP)</small>
        </div>
        <div className="form-group">
          <input value={githubUserName} onChange={ handleChange }
            type="text"
            placeholder="Github Username"
            name="githubUserName"
          />
          <small className="form-text">If you want your latest repos and a Github link, include your
            username</small>
        </div>
        <div className="form-group">
          <textarea value={bio} onChange={ handleChange } placeholder="A short bio of yourself" name="bio"></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button onClick={() => setSocialNetworkState(!socialNetworkState)} type="button" className={`btn btn-${ !socialNetworkState ? 'light' : 'primary' }`}>
            {!socialNetworkState ? 'Add ': 'Remove '} Social Network Links
          </button>
          <span>Optional</span>
        </div>
        { socialNetworkState ?
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x"></i>
              <input value={twitter} onChange={ handleChange } type="text" placeholder="Twitter URL" name="twitter" />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x"></i>
              <input value={facebook} onChange={ handleChange } type="text" placeholder="Facebook URL" name="facebook" />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x"></i>
              <input value={youtube} onChange={ handleChange } type="text" placeholder="YouTube URL" name="youtube" />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x"></i>
              <input value={linkedIn} onChange={ handleChange } type="text" placeholder="Linkedin URL" name="linkedIn" />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x"></i>
              <input value={instagram} onChange={ handleChange } type="text" placeholder="Instagram URL" name="instagram" />
            </div>
          </Fragment>: null
        }
        <input type="submit" className="btn btn-primary my-1" />
      </form>
    </section>
  )
}

CreateProfilePage.propTypes = {
  accessToken: PropTypes.string.isRequired,
  createProfile: PropTypes.func.isRequired
}

const mapStateToProps = createStructuredSelector({
  accessToken: selectAuthAccessToken,
  profile: selectProfileUserProfile,
  profileLoading: selectProfileProfileLoading
})

export default connect(mapStateToProps, { createProfile })(CreateProfilePage)
