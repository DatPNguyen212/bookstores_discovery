import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}
import { fileURLToPath } from 'url'

import express from 'express'
const app = express()
const PORT = process.env.PORT || 3000

import path from 'path'
import pathUtils from './utils/pathUtils.js'

import bookstoresRouter from './routes/bookstores.js'

const __dirname = pathUtils.getDirnamePathFromUrl(import.meta.url)
import engine from 'ejs-mate'
app.engine('ejs', engine)
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
if (path.normalize(fileURLToPath(import.meta.url)) === `${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

export default app
