import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

import express from 'express'
const app = express()
const PORT = process.env.PORT || 3000

import path from 'path'
import fileUtils from './utils/fileUtils'

import bookstoresRouter from './routes/bookstores'

const __dirname = fileUtils.getDirname()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './', 'views'))

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
