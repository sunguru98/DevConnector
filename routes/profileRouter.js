const { Router } = require('express')
const axios = require('axios')
const router = Router()
const { check, validationResult } = require('express-validator')
const authenticate = require('../middleware/authenticate')

// Models
const Profile = require('../models/Profile')
const User = require('../models/User')

// @route - POST api/profile
// @desc - Create current user's profile
// @access - Private (Header auth)
router.post('/', authenticate, 
  [check('position', 'Position is required').not().isEmpty(), check('skills', 'Skills is required').not().isEmpty()], 
  async (req, res) => {
    // Checking if any errors has been caught
    const errors = validationResult(req)
    // If there are any means, we display them as an array
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
    
    // Destructuring all the body fields of req object
    const { company, website, location, bio, position, githubUserName, skills, 
            youtube, facebook, twitter, instagram, linkedIn } = req.body
  
    // Building profile object
    const profile = { company, website, 
                      location, bio, 
                      position, githubUserName, 
                      user: req.user.id,
                      social: { youtube, facebook, twitter, instagram, linkedIn } 
                    }
    profile.skills = skills.split(',').map(skill => skill.trim())
    try {
      // Find the profile if it exists
      let profileObj = await Profile.findOne({ user: req.user.id })
      if (profileObj) {
        // If yes means, just update it
        profileObj = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profile }).select('-__v')
        return res.send({ statusCode: 200, data: { profileObj }})
      }
      // Else create a new profile and set the user property to the logged in user's id
      profileObj = new Profile(profile)
      profileObj.user = req.user.id
      await profileObj.save().select('-__v')
      res.send({ statusCode: 200, data: { profileObj }})
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ statusCode: 500, message: 'Server Error. Please try again' })
    }
})

// @route - GET api/profile
// @desc - Get all profiles
// @access - Public
router.get('/', async (req, res) => {
  try {
    const allProfiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.send({ statusCode: 200, data: { profiles: allProfiles }})
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ statusCode: 500, message: 'Server Error. Please try again' })
  }
})

// @route - GET api/profile/me
// @desc - Get current user's profile
// @access - Private (Header auth)
router.get('/me', 
  authenticate,
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']).select('-__v')
      // If there is no profile means throw err
      if (!profile) return res.status(404).send({ statusCode: 404, message: `Profile doesn't exist` })
      // Else return the profile
      res.send({ statusCode: 200, data: { profile }})
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error. Please try again' })
    }
})

// @route - GET api/profile/user/:userId
// @desc - Get profile info by USER ID
// @access - Public
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const profileByUser = await Profile.findOne({ user: userId }).populate('user', ['name', 'avatar']).select('-__v')
    // If there is no profile means throw err
    if (!profileByUser) return res.status(404).send({ statusCode: 404, message: `Profile doesn't exist` })
    // Else return the profile
    res.send({ statusCode: 200, data: { profile: profileByUser }})
  } catch (error) {
    console.error(error)
    if (error.name === 'CastError') return res.status(404).send({ statusCode: 404, message: `Profile doesn't exist` })
    res.status(500).send({ statusCode: 500, message: 'Server Error. Please try again' })
  }
})

// @route - DELETE api/profile/:userId
// @desc - Get all profiles
// @access - Private (Header auth)
router.delete('/', authenticate, async (req, res) => {
  // Get the user id first
  const userId = req.user.id
  // Delete the profile along with user
  const profile = await Profile.findOneAndDelete({ user: userId }).populate('user', ['name', 'avatar']).select('-__v')
  if (!profile) return res.status(404).send({ statusCode: 404, message: 'Profile does not exist' })
  await User.findOneAndDelete({ _id: userId })
  res.send({ statusCode: 200, data: { profile }})
})

// @route - PUT api/profile/experience
// @desc - Add an experience
// @access - Private (Header auth)
// We write the request this way to update the experience part alone
router.put('/experience', authenticate, 
  [
    check('title', 'Experience title is required').not().isEmpty(), 
    check('company', 'Experience Company is required').not().isEmpty(),
    check('current', 'Experience is Current required').not().isEmpty(),
    check('from', 'Experience from is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).send({ statusCode: 404, message: errors.array() })
    try {
      // Grab the profile first via the auth's token
      const profile = await Profile.findOne({ user: req.user.id })
      // Extract the object props of req.body
      const experienceObj = { ...req.body }
      // Add the new experience object to the front
      profile.experience.unshift(experienceObj)
      // Save the updated document
      await profile.save()
      // Send the whole profile data back along with experiences
      res.send({ statusCode: 200, data: { profile } })
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  }
)

// @route - PUT api/profile/education
// @desc - Add an education
// @access - Private (Header auth)
// We write the request this way to update the education part alone
router.put('/education', authenticate, 
  [
    check('school', 'Education school is required').not().isEmpty(), 
    check('degree', 'Education degree is required').not().isEmpty(),
    check('fieldOfStudy', 'Education is fieldOfStudy required').not().isEmpty(),
    check('current', 'Experience is Current required').not().isEmpty(),
    check('from', 'Experience from is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).send({ statusCode: 400, message: errors.array() })
    try {
      // Grab the profile first via the auth's token
      const profile = await Profile.findOne({ user: req.user.id })
      // Extract the object props of req.body
      const educationObj = { ...req.body }
      // Add the new education object to the front
      profile.education.unshift(educationObj)
      // Save the updated document
      await profile.save()
      // Send the whole profile data back along with educations
      res.send({ statusCode: 200, data: { profile } })
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  }
)

// @route - DELETE api/profile/experience/:expId
// @desc - Delete an experience from array in profile
// @access - Private (Header auth)
router.delete('/experience/:expId', authenticate, async (req, res) => {
  const expId = req.params.expId
  if (!expId) return res.status(400).send({ statusCode: 400, message: 'Invalid Experience Id' })
  // Delete the experience
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    const expIndex = profile.experience.findIndex(exp => exp._id == expId)
    if (expIndex === -1) return res.status(404).send({ statusCode: 404, message: 'Experience not found' })
    profile.experience.splice(expIndex, 1)
    await profile.save()
    res.send({ statusCode: 200, data: { profile }})
  } catch (err) {
    console.log(err.message)
    if (err.type === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - DELETE api/profile/education/:eduId
// @desc - Delete an education from array in profile
// @access - Private (Header auth)
router.delete('/education/:eduId', authenticate, async (req, res) => {
  const eduId = req.params.eduId
  if (!eduId) return res.status(400).send({ statusCode: 400, message: 'Invalid Education Id' })
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    const eduIndex = profile.education.findIndex(edu => edu.id == eduId)
    if (eduIndex === -1) return res.status(404).send({ statusCode: 404, message: 'Education not found' })
    // Delete the education
    profile.education.splice(eduIndex, 1)
    await profile.save()
    res.send({ statusCode: 200, data: { profile }})
  } catch (err) {
    console.log(err.message)
    if (err.type === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Id. Please try again' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

// @route - GET api/profile/github/:username
// @desc - Get Github repos for that username
// @access - Public
router.get('/github/:username', async (req, res) => {
  try {
    const githubRepos = await axios.get(`https://api.github.com/users/${req.params.username}/repos`, {
      params: {
        per_page: '5',
        sort: 'created:asc',
        client_id: process.env.GITHUB_CLIENT,
        client_secret: process.env.GITHUB_SECRET      
      }
    })
    res.send({ statusCode: 200, data: { repos: githubRepos.data } })
  } catch (err) {
    console.error(err.message)
    if (err.message === 'Request failed with status code 404')
      return res.status(404).send({ statusCode: 404, message: 'User not found' })
    res.status(500).send({ statusCode: 500, message: 'Server Error' })
  }
})

module.exports = router