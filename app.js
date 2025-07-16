if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import express from 'express'
const app = express()
const PORT = process.env.PORT || 3000

import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import bookstoresRouter from './routes/bookstores'

const pathToCurrentFile = fileURLToPath(import.meta.url)
const __dirname = dirname(pathToCurrentFile)
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
