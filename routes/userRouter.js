const express = require('express')
const router = express.Router()
const User = require('../models/User')

// @route - POST /api/users
// @desc - Create a new user
// @access - Public
router.post('/', async (req, res) => {
  try {
    // User shouldnt be created if there is already one ..
    if (await User.findOne({ email: req.body.email })) throw new Error('Email already exists')
    // Trying to create the user, if no validation errors are present
    let user = await User.create(req.body)
    // Creating the JSON Web Token
    const token = await user.generateJSONToken()
    // Fetch the gravatar pic
    await user.fetchGravatar()
    // Send all the details
    res.send({ statusCode: 200, user, token: `Bearer ${token}`, expiresIn: '24h' })
  } catch (err) {
    res.status(400).send({ statusCode: 400, message: err.message })
  }
})

module.exports = router