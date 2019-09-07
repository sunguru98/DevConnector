const mongoose = require('mongoose')

const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')

// Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate (value) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid')
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be atleast 8 characters long']
  },
  avatar: String,
  accessToken: String
}, {
  timestamps: true
})

// Model methods (Entire class methods)
userSchema.statics = {
  authenticateUser: async (email, password) => {
    // Checking whether user's email exists
    const user = await User.findOne({ email })
    if (!user) throw new Error('Incorrect credentials')
    // Verifying passwords are same
    const isMatched = await bcrypt.compare(password, user.password)
    if (!isMatched) throw new Error('Incorrect Credentials')
    // If the passwords are matched means return the user
    return user
  }
}

// Instance methods (Specific to particular object)
userSchema.methods = {
  // We use generic function for binding this keyword. 'this' represents the User instance
  // Generating JWT for auth reference
  generateJSONToken: async function () {
    // Generating the token using JWT and assigning to the token database column
    const token = await jwt.sign({ id: this.id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
    this.accessToken = token
    await this.save()
    // Returning the JWT
    return token
  },
  // Deleting unnecessary data while sending back to the user
  toJSON: function () {
    let user = this.toObject()
    delete user.password
    delete user.__v
    delete user.accessToken
    return user
  },
  // Fetching the gravatar picture, if the user has signed in with gravatar
  fetchGravatar: async function () {
    const avatar = gravatar.url(this.email, { size: '200', rating: 'pg', default: 'mm' }).replace('//', '')
    this.avatar = avatar
    await this.save()
  }
}

// Middleware (here also we use function for binding current instance)
userSchema.pre('save', async function (next) {
  // Do this only if the password is changed, or empty
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
  }
  // Move on to the creation process
  next()
})

const User = mongoose.model('user', userSchema)

module.exports = User