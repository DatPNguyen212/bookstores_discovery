// Express App
const express = require('express')
const app = express()
const PORT = 8080

// Built-in Node Modules
const path = require('path')

// Router objects
const bookstoresRouter = require('./routes/bookstores')

// Configuring view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './', 'views'))

//=========== Routes================

// Bookstore routes
app.use('/bookstores', bookstoresRouter)

// GET homepage
app.get('/', (req, res, next) => {
  res.render('home.ejs')
})

// GET fallback
app.get(/(.)*/, (req, res, next) => {
  res.render('error.ejs')
})

// Check if this file is directly run by node command, if true then make app listen at port
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

module.exports = app
