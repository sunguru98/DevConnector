import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import AlertList from '../components/AlertList'
import Spinner from '../components/Spinner'
import Moment from 'react-moment'
import { postComment, getPostById, deleteComment } from '../redux/actions/postActions'
import { selectPostSinglePost, selectPostPostLoading } from '../redux/selectors/postSelectors'
import { selectAuthAccessToken, selectAuthUser } from '../redux/selectors/authSelectors'
import { connect } from 'react-redux'

const PostDetailPage = ({ history, user, accessToken, post, getPostById, postComment, deleteComment, postLoading, match: { params: { postId } } }) => {

  useEffect(() => {
    getPostById(accessToken, history, postId)
  }, [getPostById, accessToken, history, postId])

  const [formState, setFormState] = useState({ text: '' })

  const handleSubmit = event => {
    event.preventDefault()
    postComment(accessToken, history, postId, formState.text)
  }

  const handleChange = event => setFormState({ ...formState, [event.target.name]: event.target.value })

  return (
    !post ? <Spinner /> :
    <section className="container">
      <AlertList />
      <Link to='/posts' className="btn">Back To Posts</Link>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/developer/${post.user._id}`}>
            <img
              className="round-img"
              src={`https://${post.user.avatar}`}
              alt="User avatar"
            />
            <h4>{post.user.name}</h4>
          </Link>
        </div>
        <div><p className="my-1">{post.text}</p></div>
      </div>

      <div className="post-form">
        <div className="bg-primary p">
          <h3>Leave A Comment</h3>
        </div>
        <form className="form my-1" onSubmit={handleSubmit}>
          <textarea
            onChange={ handleChange }
            name="text"
            cols="30"
            rows="5"
            placeholder="Comment on this post"
            required
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>

      { post.comments.length ?
        !postLoading ? <Spinner /> : 
          <div className="comments">
            {post.comments.map(comment => 
              <div className="post bg-white p-1 my-1">
                <div>
                  <Link to={`/developer/${comment.user}`}>
                    <img
                      className="round-img"
                      src={`https://${comment.avatar}`}
                      alt="User avatar"
                    />
                    <h4>{comment.name}</h4>
                  </Link>
                </div>
                <div>
                  <p className="my-1">{comment.text}</p>
                  <p className="post-date">Posted on <Moment format='DD/MM/YYYY'>{comment.createdAt}</Moment></p>
                  { user._id === comment.user ? <button onClick={() => deleteComment(accessToken, history, comment._id, post._id)} className='btn btn-danger'>
                    <i className='fas fa-times' />
                  </button> : null } 
                </div>
              </div>)}
          </div> 
        : 
        null }
    </section>
  )
}

PostDetailPage.propTypes = {
  getPostById: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  postLoading: PropTypes.bool.isRequired
}

const mapStateToProps = createStructuredSelector({
  accessToken: selectAuthAccessToken,
  post: selectPostSinglePost,
  postLoading: selectPostPostLoading,
  user: selectAuthUser
})

export default connect(mapStateToProps, { postComment, getPostById, deleteComment })(PostDetailPage)
