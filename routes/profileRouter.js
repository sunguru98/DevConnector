const express = require('express')
const authenticate = require('../middleware/authenticate')
const router = express.Router()

// Models
const Profile = require('../models/Profile')
const User = require('../models/User')

// @route - /api/profile/me
// @desc - Get current user's profile
// @access - Private (Header auth)
router.get('/me', authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
    // If there is no profile means throw err
    if (!profile) return res.status(404).send({ statusCode: 404, message: 'Profile doesnt exist' })
    // Else return the profile
    return profile
  } catch (err) {
    res.status(500).send({ statusCode: 500, message: 'Server Error. Please try again' })
  }
})

module.exports = router