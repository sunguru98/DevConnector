import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../components/Spinner'
import AlertList from '../components/AlertList'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCurrentUserProfile } from '../redux/actions/profileActions'

import { selectAuthUser, selectAuthAccessToken } from '../redux/selectors/authSelectors'
import { createStructuredSelector } from 'reselect'
import { selectProfileUserProfile, selectProfileProfileLoading } from '../redux/selectors/profileSelectors'

const DashboardPage = ({ user, getCurrentUserProfile, accessToken, profile, profileLoading }) => {
  useEffect(() => {
    getCurrentUserProfile(accessToken)
  }, [])
  
  return (
    !profile && profileLoading ?
      <Spinner /> :
       !profile ? <Redirect to='/create-profile' /> :
        <section className="container">
          <AlertList />
          <h1 className="large text-primary">Dashboard</h1>
          <p className="lead"><i className="fas fa-user"></i> Welcome { user.name }</p>
          <div className="dash-buttons">
            <Link to='/edit-profile' className="btn btn-light"
              ><i className="fas fa-user-circle text-primary"></i> Edit Profile</Link>
            <a href="add-experience.html" className="btn btn-light"
              ><i className="fab fa-black-tie text-primary"></i> Add Experience</a>
            <a href="add-education.html" className="btn btn-light"
              ><i className="fas fa-graduation-cap text-primary"></i> Add Education</a>
          </div>

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
              <tr>
                <td>Tech Guy Web Solutions</td>
                <td className="hide-sm">Senior Developer</td>
                <td className="hide-sm">
                  02-03-2009 - 01-02-2014
                </td>
                <td>
                  <button className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
              <tr>
                <td>Traversy Media</td>
                <td className="hide-sm">Instructor & Developer</td>
                <td className="hide-sm">
                  02-03-2015 - Now
                </td>
                <td>
                  <button className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

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
              <tr>
                <td>Northern Essex</td>
                <td className="hide-sm">Associates</td>
                <td className="hide-sm">
                  02-03-2007 - 01-02-2009
                </td>
                <td>
                  <button className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

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
