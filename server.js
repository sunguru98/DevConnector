const express = require('express')

// Configuring Process environment variables
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

// Database
require('./db')

const app = express()
const PORT = process.env.PORT || 3000

// All middlewares
app.use(express.json({ extended: false }))

// Integrating the routers
app.use('/api/users', require('./routes/userRouter'))
app.use('/api/profile', require('./routes/profileRouter'))
app.use('/api/posts', require('./routes/postsRouter'))
app.use('/api/auth', require('./routes/authRouter'))

app.get('/', (req, res) => res.send('Hello'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
