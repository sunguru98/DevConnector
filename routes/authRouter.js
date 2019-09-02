const express = require('express')
const authenticate = require('.././middleware/authenticate')
const jwt = require('jsonwebtoken')
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

module.exports = router