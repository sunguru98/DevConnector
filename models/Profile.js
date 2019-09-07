const mongoose = require('mongoose')

// Schema
const profileSchema = new mongoose.Schema({
  // Foreign Key
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  // Regular props
  company: String,
  website: String,
  location: String,
  position: { type: String, required: [true, 'Position is required'] },
  skills: { type: [String], required: [true, 'Skills is required'] },
  bio: String,
  githubUserName: String,
  // Multi inner field properties
  // Array of objects
  experience: [{
    title: { type: String, required: [true, 'Experience title is required'] },
    company: { type: String, required: [true, 'Experience company is required'] },
    location: String,
    from: { type: Date, required: [true, 'Experience from is required'] },
    to: Date,
    current: { type: Boolean, required: [true, 'Experience current is required'] },
    description: String,
  }],
  education: [{
    school: { type: String, required: [true, 'Education school is required'] },
    degree: { type: String, required: [true, 'Education degree is required'] },
    fieldOfStudy: { type: String, required: [true, 'Education fieldOfStudy is required'] },
    from: { type: Date, required: [true, 'Education from is required'] },
    to: Date,
    current: { type: Boolean, required: [true, 'Education current is required'] },
    description: String,
  }],
  // Single object but multi fields
  social: {
    youtube: String,
    twitter: String,
    facebook: String,
    linkedIn: String,
    instagram: String
  }
}, { timestamps: true });

const Profile = mongoose.model('profile', profileSchema)

module.exports = Profile