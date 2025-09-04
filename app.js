import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

import express from 'express'

import path from 'path'
import pathUtils from './utils/pathUtils.js'
import { fileURLToPath } from 'url'

import engine from 'ejs-mate'

import setupDB from './config/setupDB.js'

import createBookstoreRouter from './routes/bookstores.js'

let connection

function createApp(connection) {
  const app = express()

  const __dirname = pathUtils.getDirnamePathFromUrl(import.meta.url)
  app.engine('ejs', engine)
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, './', 'views'))

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(express.static(path.join(__dirname, 'public')))

  // Bookstore routes
  app.use('/bookstores', createBookstoreRouter(connection))

  // GET homepage
  app.get('/', (req, res, next) => {
    res.render('home.ejs')
  })

  // GET fallback
  app.get(/(.)*/, (req, res, next) => {
    res.render('error.ejs')
  })

  return app
}

async function startApp() {
  const PORT = process.env.PORT || 3000

  // When testing, we're connecting to test DB in the test file there using testDBUtils.connect(), so ONLY when we're NOT testing, we actually use setupDB.connect() to connect to real database.
  if (process.env.NODE_ENV !== 'test') {
    connection = await setupDB.connect(
      'mongodb://127.0.0.1:27017/bookstoreDiscovery'
    )
  }

  const app = createApp(connection)

  // Check if this file is directly run by node command, if true then make app listen at port
  if (path.normalize(fileURLToPath(import.meta.url)) === `${process.argv[1]}`) {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }
}

if (path.normalize(fileURLToPath(import.meta.url)) === `${process.argv[1]}`) {
  startApp()
}
export default createApp
