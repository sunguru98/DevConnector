const express = require('express')

const router = express.Router()

// @route - /api/profile
// @desc - All profile
// @access - Public
router.get('/', (req, res) => {
  res.send('Auth router')
})

module.exports = router