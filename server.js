const express = require('express')
const path = require('path')
// Configuring Process environment variables
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

// Database
require('./db')

const app = express()
const PORT = process.env.PORT || 4000

// All middlewares
app.use(express.json({ extended: false }))

// Integrating the routers
app.use('/api/users', require('./routes/userRouter'))
app.use('/api/profile', require('./routes/profileRouter'))
app.use('/api/posts', require('./routes/postsRouter'))
app.use('/api/auth', require('./routes/authRouter'))

// Serve react (static)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "client", "build")))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
