const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
// @route - POST /api/users
// @desc - Create a new user
// @access - Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    check('password', 'Password should be minimum 8 characters').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
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
      res.send({ statusCode: 200, user, accessToken: `Bearer ${token}`, expiresIn: '24h' })
    } catch (err) {
      res.status(400).send({ statusCode: 400, message: err.message })
    }
})

module.exports = router