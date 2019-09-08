const { Schema, model } = require('mongoose')

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' }
})