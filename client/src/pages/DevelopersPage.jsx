import React, { useEffect } from 'react'
import Spinner from '../components/Spinner'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { selectProfileAllProfiles } from '../redux/selectors/profileSelectors'
import { getAllProfiles } from '../redux/actions/profileActions'

const DevelopersPage = ({ profiles, getAllProfiles }) => {
  useEffect(() => {
    getAllProfiles()
    document.title = 'Devconnector - Developers'
  }, [getAllProfiles])
  return (
    profiles.length === 0 ? <Spinner/> :
    <section className="container">
      <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i> Browse and connect with developers
      </p>
      <div className="profiles">
        { profiles.map(profile => (
          <div className="profile bg-light" key={profile._id}>
            <img
              className="round-img"
              src={`https://${profile.user.avatar}`}
              alt="User Avatar"
            />
            <div>
              <h2>{profile.user.name}</h2>
              <p>{`${profile.position} at ${profile.company}`}</p>
              <p>{profile.location}</p>
              <Link to={`/developer/${profile.user._id}`} className="btn btn-primary">View Profile</Link>
            </div>
            <ul>
              { profile.skills.map((skill, index) => (
                <li className="text-primary" key={index}>
                  <i className="fas fa-check"></i> {skill}
                </li>
              )) }
            </ul>
          </div>
        )) }
      </div>
    </section>
  )
}

DevelopersPage.propTypes = {
  profiles: PropTypes.array.isRequired,
  getAllProfiles: PropTypes.func.isRequired
}

const mapStateToProps = createStructuredSelector({
  profiles: selectProfileAllProfiles
})

export default connect(mapStateToProps, { getAllProfiles })(DevelopersPage)
