const express = require('express')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
// Database
require('./db')
// Routers
const userRouter = require('./routes/userRouter')
const authRouter = require('./routes/authRouter')
const postsRouter = require('./routes/postsRouter')
const profileRouter = require('./routes/profileRouter')

const app = express()
const PORT = process.env.PORT || 3000

// All middlewares
app.use(express.json({ extended: false }))

// Integrating the routers
app.use('/api/users', userRouter)
app.use('/api/profile', authRouter)
app.use('/api/posts', postsRouter)
app.use('/api/auth', profileRouter)

app.get('/', (req, res) => res.send('Hello'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
