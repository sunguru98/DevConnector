const { Schema, model } = require('mongoose')

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  text: { type: String, required: true },
  likes: [
    { 
      user: { type: Schema.Types.ObjectId, ref: 'user' },
      name: String,
      avatar: String 
    }
  ],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'user' },
      name: String,
      avatar: String,
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now() },
    }
  ]
}, { timestamps: true })

postSchema.methods = {
  toJSON: function () {
    let post = this.toObject()
    delete post.__v
    return post
  }
}

const Post = model('post', postSchema)

module.exports = Post