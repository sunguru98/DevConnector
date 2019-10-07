import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { selectProfileGithubRepos, selectProfileUserProfile } from '../redux/selectors/profileSelectors'
import { getProfileByUserId, getGithubRepos, clearProfile } from '../redux/actions/profileActions'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import Spinner from '../components/Spinner'
import AlertList from '../components/AlertList'

const DeveloperDetailPage = ({ history, profile, githubRepos, getProfileByUserId, getGithubRepos, clearProfile, match: { params: { developerId } } }) => {

  useEffect(() => {
    const fetchData = async () => {
      const profileObj = await getProfileByUserId(developerId, history)
      if (profileObj) getGithubRepos(profileObj.githubUserName)
    }
    fetchData()
  }, [developerId, getProfileByUserId, getGithubRepos, history])

  const handleClick = async () => {
    await clearProfile()
    history.push('/developers')
  }

  return (
    !profile && githubRepos.length === 0 ? <Spinner/> :
    <section className="container">
      <AlertList />
      <button onClick={ handleClick } className="btn btn-light">Back To Profiles</button>
      <div className="profile-grid my-1">
        <div className="profile-top bg-primary p-2">
          <img
            className="round-img my-1"
            src={`https://${profile.user.avatar}`}
            alt="User avatar"
          />
          <h1 className="large">{profile.user.name}</h1>
          <p className="lead">{`${profile.position} at ${profile.company}`}</p>
          <p>{profile.location}</p>
          <div className="icons my-1">
            { profile.website ? <a href={profile.website.match(/https|http/g) ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe fa-2x"></i>
            </a> : null }
            { profile.social.twitter ? <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter fa-2x"></i>
            </a> : null }
            { profile.social.facebook ? <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook fa-2x"></i>
            </a> : null }
            { profile.social.linkedIn ? <a href={profile.social.linkedIn} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin fa-2x"></i>
            </a> : null }
            { profile.social.youtube ? <a href={profile.social.youtube} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube fa-2x"></i>
            </a> : null }
            { profile.social.instagram ? <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram fa-2x"></i>
            </a> : null } 
          </div>
        </div>

         
        <div className="profile-about bg-light p-2">
          <h2 className="text-primary">{profile.user.name}'s Bio</h2>
          <p>{profile.bio}</p>
          <div className="line"></div>
          <h2 className="text-primary">Skill Set</h2>
          <div className="skills">
            { profile.skills.map((skill, index) => <div key={index} className="p-1"><i className="fa fa-check"></i> {skill}</div>) }
          </div>
        </div>

         
        { profile.experience.length > 0 ? <div className="profile-exp bg-white p-2">
          <h2 className="text-primary">Experience</h2>
          { profile.experience.map(exp => <div key={exp._id}>
            <h3 className="text-dark">{exp.company}</h3>
            <p>
              <Moment format='DD/MM/YYYY'>{exp.from}</Moment> - {exp.current ? 'Present' : <Moment format='DD/MM/YYYY'>{exp.to}</Moment>}
            </p>
            <p><strong>Position: </strong>{exp.title}</p>
            <p>
              <strong>Description: </strong>{exp.description}.
            </p>
          </div>) }
        </div> : null }

        { profile.education.length > 0 ? <div className="profile-edu bg-white p-2">
          <h2 className="text-primary">Education</h2>
          { profile.education.map(edu => <div key={edu._id} >
            <h3>{edu.school}</h3>
            <Moment format='DD/MM/YYYY'>{edu.from}</Moment> - {edu.current ? 'Present' : <Moment format='DD/MM/YYYY'>{edu.to}</Moment>}
            <p><strong>Degree: </strong>{edu.degree}</p>
            <p><strong>Field Of Study: </strong>{edu.fieldOfStudy}</p>
            <p>
              <strong>Description: </strong>{edu.description}
            </p>
          </div>) }
        </div> : null }

        { githubRepos.length ?
          <div className="profile-github">
            <h2 className="text-primary my-1">
              <i className="fab fa-github"></i> Github Repos
            </h2>
            { githubRepos.map(repo => <div key={repo.id} className="repo bg-white p-1 my-1">
              <div>
                <h4><a href={repo.html_url} target="_blank"
                    rel="noopener noreferrer">{repo.name}</a></h4>
                <p>{repo.description}</p>
              </div>
              <div>
                <ul>
                  <li className="badge badge-primary">Stars: {repo.stargazers_count}</li>
                  <li className="badge badge-dark">Watchers: {repo.watchers_count}</li>
                  <li className="badge badge-light">Forks: {repo.forks_count}</li>
                </ul>
              </div>
            </div>) }
          </div> : null }

      </div>
    </section>
  )
}

DeveloperDetailPage.propTypes = {
  getProfileByUserId: PropTypes.func.isRequired,
  developerId: PropTypes.string,
  githubRepos: PropTypes.array.isRequired,
  getGithubRepos: PropTypes.func.isRequired
}

const mapStateToProps = createStructuredSelector({
  githubRepos: selectProfileGithubRepos,
  profile: selectProfileUserProfile
})

export default connect(mapStateToProps, { getProfileByUserId, getGithubRepos, clearProfile })(DeveloperDetailPage)
