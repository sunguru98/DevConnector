const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const authenticate = require('../middleware/authenticate')
// models
const Post = require('../models/Post')

// @route - POST/api/posts
// @desc - Create a post
// @access - Private (Auth Header)
router.post('/', authenticate, [check('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).send({ statusCode: 400, message: errors.array() })
    try {
      const post = new Post(req.body)
      post.user = req.user.id
      await post.save()
      res.send({ statusCode: 200, data: { post, name: req.user.name, avatar: req.user.avatar }})
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  }
)

// @route - GET/api/posts
// @desc - Get all posts
// @access - Private (Auth Header)
router.get('/', authenticate, async (req, res) => {
  try {
    const posts = await Post.find().select('-__v').sort('createdAt').populate('user', ['name', 'avatar'])
    console.log(posts)
    res.send({ statusCode: 200, posts })
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - GET/api/posts/:postId
// @desc - Get particular post
// @access - Private (Auth Header)
router.get('/:postId', authenticate, async (req, res) => {
  try {
    // Get the particular Post where the user property matches with the req.user's id
    const post = await Post.findOne({ _id: req.params.postId }).select('-__v').populate('user', ['name', 'avatar'])
    if (!post) return res.status(404).send({ statusCode: 404, message: 'Post not found' })
    res.send({ statusCode: 200, post })
  } catch (err) {
    console.error(err)
    if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - GET/api/posts/me
// @desc - Get all posts of the logged in user
// @access - Private (Auth Header)
router.get('/me', authenticate, async (req, res) => {
  try {
    // Get all Posts where the user property matches with the req.user's id
    const posts = await Post.find({ user: req.user.id }).select('-__v').sort({ 'createdAt': -1 }).populate('user', ['name', 'avatar'])
    res.send({ statusCode: 200, posts })
  } catch (err) {
    console.error(err)
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - GET/api/posts/me/:postId
// @desc - Get particular post of that user
// @access - Private (Auth Header)
router.get('/me/:postId', authenticate, async (req, res) => {
  try {
    // Get the particular Post where the user property matches with the req.user's id
    const post = await Post.findOne({ user: req.user.id, _id: req.params.postId }).select('-__v')
    if (!post) return res.status(404).send({ statusCode: 404, message: 'Post not found' })
    res.send({ statusCode: 200, post })
  } catch (err) {
    console.error(err)
    if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - DELETE /api/posts/:postId
// @desc - Delete particular post of that user
// @access - Private (Auth Header)
router.delete('/:postId', authenticate, async (req, res) => {
  try {
    // Get the particular Post where the user property matches with the req.user's id and delete it
    const post = await Post.findOneAndDelete({ user: req.user.id, _id: req.params.postId }).select('-__v')
    if (!post) return res.status(404).send({ statusCode: 404, message: 'Post not found' })
    res.send({ statusCode: 200, post })
  } catch (err) {
    console.error(err)
    if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - PUT /api/posts/like/:postId
// @desc - Like a particular post
// @access - Private (Auth Header)
router.put('/like/:postId', authenticate, async (req, res) => {
  try {
    // Get the particular Post
    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).send({ statusCode: 404, message: 'Post not found' })
    // Create the like object
    const likeObject = { user: req.user.id, name: req.user.name, avatar: req.user.avatar }
    // Check whether the like is already present
    if (!post.likes.find(like => like.user == req.user.id)) {
      post.likes.unshift(likeObject)
      await post.save()
    }
    // Send back the updated post
    res.send({ statusCode: 200, post })
  } catch (err) {
    console.error(err)
    if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - DELETE /api/posts/like/:postId
// @desc - Unlike a particular post
// @access - Private (Auth Header)
router.delete('/like/:postId', authenticate, async (req, res) => {
  try {
    // Get the particular Post
    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).send({ statusCode: 404, message: 'Post not found' })
    // Delete the like by filtering it only if there is a like object of that user ..
    if (post.likes.find(like => like.user.toString() === req.user.id)) {
      post.likes = post.likes.filter(like => like.user.toString() !== req.user.id)
      await post.save()
    } else return res.status(404).send({ statusCode: 404, message: 'Post has not been liked by the user' })
    // Send back the updated post
    res.send({ statusCode: 200, post })
  } catch (err) {
    console.error(err)
    if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - PUT /api/posts/comment/:postId
// @desc - comment a particular post
// @access - Private (Auth Header)
router.put('/comment/:postId', authenticate, check('text', 'Text is required').not().isEmpty(), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
  try {
    // Get the particular Post
    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).send({ statusCode: 404, message: 'Post not found' })
    // Create the comment object
    const commentObject = { user: req.user.id, name: req.user.name, avatar: req.user.avatar, text: req.body.text }
    // Check whether the comment's text and user is already present
    if (!post.comments.find(comment => comment.user.toString() === req.user.id && comment.text === req.body.text)) {
      post.comments.unshift(commentObject)
      await post.save()
    }
    // Send back the updated post
    res.send({ statusCode: 200, post })
  } catch (err) {
    console.error(err)
    if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - DELETE /api/posts/comment/:postId/:commentId
// @desc - Uncomment a particular post
// @access - Private (Auth Header)
router.delete('/comment/:postId/:commentId', authenticate, async (req, res) => {
  try {
    // Get the particular Post
    const post = await Post.findById(req.params.postId)
    if (!post) return res.status(404).send({ statusCode: 404, message: 'Post not found' })
    // Delete the comment by filtering it only if there is a comment object of that user ..
    if (post.comments.find(comment => comment.user.toString() === req.user.id && comment._id.toString() === req.params.commentId)) {
      post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.commentId)
      await post.save()
    } else return res.status(404).send({ statusCode: 404, message: 'No comments found' })
    // Send back the updated post
    res.send({ statusCode: 200, post })
  } catch (err) {
    console.error(err)
    if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

module.exports = router