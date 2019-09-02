const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
  const accessToken = req.header('Authentication').replace('Bearer ', '')
  try {
    if (!accessToken) throw new Error()
    const { id } = await jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
    const user = await User.findOne({ _id: id, accessToken })
    if (!user) throw new Error()
    req.user = user
    req.accessToken = accessToken
    next()
  } catch (err) {
    return res.status(401).send({ errorCode: 401, message: 'Invalid Token / Expired' })
  }
}

module.exports = authenticate