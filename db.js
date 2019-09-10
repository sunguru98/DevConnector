const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI.replace('<password>', 'Sundeep1998'), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(connection => console.log('Database connected succesfully'))
  .catch(err => console.log(err.message))