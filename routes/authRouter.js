const express = require('express')

const router = express.Router()

// @route - /api/auth
// @desc - All auth
// @access - Public
router.get('/', (req, res) => {
res.send('Auth router')
})

module.exports = router