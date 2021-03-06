const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
  // Get the token from the passed header
  let accessToken = req.header('Authorization')
  try {
    // If no token means throw error
    if (!accessToken) throw new Error('No token')
    // Else verify its signature, to check for correctness and validity
    accessToken = accessToken.replace('Bearer ', '')
    const { id } = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
    // Try to find the user from the database, where id is the token's payload id and token
    const user = await User.findOne({ _id: id, accessToken })
    // If no user is present means, throw error
    if (!user) throw new Error('No user')
    // Else pass the user object and the token onto the req method for future uses
    req.user = user
    req.accessToken = accessToken
    // Move on to the next function
    next()
  } catch (err) {
    console.log(err.message)
    return res.status(401).send({ statusCode: 401, message: 'Invalid Authentication' })
  }
}

module.exports = authenticate