import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../components/Spinner'
import AlertList from '../components/AlertList'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { Helmet } from 'react-helmet'
import { getCurrentUserProfile } from '../redux/actions/profileActions'

import { selectAuthUser, selectAuthAccessToken } from '../redux/selectors/authSelectors'
import { createStructuredSelector } from 'reselect'
import { selectProfileUserProfile, selectProfileProfileLoading } from '../redux/selectors/profileSelectors'

const DashboardPage = ({ user, getCurrentUserProfile, accessToken, profile, profileLoading }) => {
  useEffect(() => {
    getCurrentUserProfile(accessToken)
  }, [getCurrentUserProfile, accessToken])

  return (
    !profile && profileLoading ?
      <Spinner /> :
       !profile ? <Redirect to='/create-profile' /> :
        <section className="container">
          <Helmet><title>DevConnector - Dashboard</title></Helmet>
          <AlertList />
          <h1 className="large text-primary">Dashboard</h1>
          <p className="lead"><i className="fas fa-user"></i> Welcome { user.name }</p>
          <div className="dash-buttons">
            <Link to='/edit-profile' className="btn btn-light">
              <i className="fas fa-user-circle text-primary"></i> Edit Profile
            </Link>
            <Link to="/add-experience" className="btn btn-light">
              <i className="fab fa-black-tie text-primary"></i> Add Experience
            </Link>
            <Link to="/add-education" className="btn btn-light">
              <i className="fas fa-graduation-cap text-primary"></i> Add Education
            </Link>
          </div>
          { 
            profile.experience.length > 0 &&
            <Fragment> 
              <h2 className="my-2">Experience Credentials</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th className="hide-sm">Title</th>
                    <th className="hide-sm">Years</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  { profile.experience.map(exp => (
                      <tr key={exp._id}>
                        <td>{ exp.company }</td>
                        <td className="hide-sm">{exp.title}</td>
                        <td className="hide-sm">
                          <Moment format='DD/MM/YYYY'>{exp.from}</Moment> - {exp.current ? 'Present' : <Moment format='DD/MM/YYYY'>exp.to</Moment>}
                        </td>
                        <td>
                          <button className="btn btn-danger">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </Fragment>
          }

          { 
            profile.education.length > 0 &&
            <Fragment> 
              <h2 className="my-2">Education Credentials</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>School</th>
                    <th className="hide-sm">Degree</th>
                    <th className="hide-sm">Years</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  { profile.education.map(edu => (
                    <tr key={edu._id}>
                      <td>{edu.school}</td>
                      <td class="hide-sm">{edu.degree}</td>
                      <td class="hide-sm">
                      <Moment format='DD/MM/YYYY'>{edu.from}</Moment> - {edu.current ? 'Present' : <Moment format='DD/MM/YYYY'>{edu.to}</Moment>}
                      </td>
                      <td>
                        <button class="btn btn-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Fragment>
          }
          <div className="my-2">
            <button className="btn btn-danger">
                <i className="fas fa-user-minus"></i>
                Delete My Account
            </button>
          </div>
        </section>
  )
}

DashboardPage.propTypes = {
  getCurrentUserProfile: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
  profile: PropTypes.object,
  // isLoading: PropTypes.bool.isRequired
}

const mapStateToProps = createStructuredSelector({
  user: selectAuthUser,
  accessToken: selectAuthAccessToken,
  profile: selectProfileUserProfile,
  profileLoading: selectProfileProfileLoading
})

export default connect(mapStateToProps, { getCurrentUserProfile })(DashboardPage)
