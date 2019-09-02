const express = require('express')

const router = express.Router()

// @route - /api/posts
// @desc - All posts
// @access - Public
router.get('/', (req, res) => {
  res.send('Auth router')
})

module.exports = router