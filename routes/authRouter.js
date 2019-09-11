const express = require('express')
const authenticate = require('.././middleware/authenticate')
const User = require('../models/User')

const router = express.Router()

// @route - POST/api/auth
// @desc - Authenticate user
// @access - Public
router.post('/', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.authenticateUser(email, password)
    const accessToken = await user.generateJSONToken()
    return res.send({ statusCode: 200, user, accessToken: `Bearer ${accessToken}`, expiresIn: '24h' })
  } catch (err) {
    res.status(401).send({ statusCode: 401, message: err.message })
  }
})

// @route - GET/api/auth
// @desc - Get auth user object
// @access - Private
router.get('/', authenticate, (req, res) => {
  res.send({ statusCode: 200, data: { user: req.user }})
})

// @route - DELETE/api/auth/
// @desc - Logout user
// @access - Private
router.delete('/', authenticate, async (req, res) => {
  const user = req.user
  user.accessToken = null
  try {
    await user.save()
    res.send({ statusCode: 200, data: 'User logged out successfully '})
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

module.exports = router