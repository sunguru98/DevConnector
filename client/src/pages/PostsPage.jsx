import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../components/Spinner'
import AlertList from '../components/AlertList'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { createStructuredSelector } from 'reselect'
import { getAllPosts, createPost, deletePostById, likePostById, dislikePostById } from '../redux/actions/postActions'
import { selectAuthAccessToken, selectAuthUser } from '../redux/selectors/authSelectors'
import { selectPostAllPosts, selectPostPostLoading } from '../redux/selectors/postSelectors'

const PostsPage = ({ accessToken, getAllPosts, createPost, allPosts, deletePostById, likePostById, dislikePostById, postLoading, history, user }) => {

  const [formState, setFormState] = useState({ text: '' })

  useEffect(() => {
    getAllPosts(accessToken, history, user._id)
  }, [getAllPosts, accessToken, history, user._id])

  const handleChange = e => setFormState({ ...formState, [e.target.name]: e.target.value })
  const handleSubmit = e => {
    e.preventDefault()
    createPost(accessToken, formState.text, history)
  }

  return (
    <section className="container">
      <Helmet><title>Dev Connector - Posts</title></Helmet>
      <AlertList />
      <h1 className="large text-primary">
        Posts
      </h1>
      <p className="lead"><i className="fas fa-user"></i> Welcome to the community!</p>

      <div className="post-form">
        <div className="bg-primary p">
          <h3>Say Something...</h3>
        </div>
        <form className="form my-1" onSubmit={handleSubmit}>
          <textarea
            onChange={handleChange}
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            required
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>

      { !allPosts.length || !postLoading ? <Spinner/> : <div className="posts">
        { allPosts.map(post => <div key={post._id} className="post bg-white p-1 my-1">
          <div>
            <Link to={`/developer/${post.user._id}`}>
              <img
                className="round-img"
                src={`https://${post.user.avatar}`}
                alt="Post user avatar"
              />
              <h4>{post.user.name}</h4>
            </Link>
          </div>
          <div>
            <p className="my-1">
              {post.text}
            </p>
             <p className="post-date">
                Posted on <Moment format='DD/MM/YYYY'>{post.createdAt}</Moment>
            </p>
            <button disabled={post.isLiked} onClick={ () => likePostById(accessToken, post._id, user, history) } className={`btn btn-${!post.isLiked ? 'light' : 'primary'}`}>
              <i className="fas fa-thumbs-up"></i>
              <span>{post.likes.length}</span>
            </button>
            <button onClick={() => dislikePostById(accessToken, post._id, user, history)} disabled={!post.isLiked} className={`btn btn-${post.isLiked ? 'light' : 'danger'}`}>
              <i className="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/post/${post._id}`} className="btn btn-primary">
              Discussion <span className='comment-count'>{post.comments.length}</span>
            </Link>
            { user._id === post.user._id ? <button
              onClick={() => deletePostById(accessToken, post._id, history)}
              type="button"
              className="btn btn-danger">
              <i className="fas fa-times"></i>
            </button> : null }
          </div>
        </div>) }
      </div>}
    </section>
  )
}

PostsPage.propTypes = {
  getAllPosts: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  allPosts: PropTypes.array.isRequired,
  postLoading: PropTypes.bool.isRequired,
  accessToken: PropTypes.string.isRequired,
  deletePostById: PropTypes.func.isRequired,
  likePostById: PropTypes.func.isRequired
}

const mapStateToProps = createStructuredSelector({
  allPosts: selectPostAllPosts,
  postLoading: selectPostPostLoading,
  accessToken: selectAuthAccessToken,
  user: selectAuthUser
})

export default connect(mapStateToProps, { getAllPosts, createPost, deletePostById, likePostById, dislikePostById })(PostsPage)
