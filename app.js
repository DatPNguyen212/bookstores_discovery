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
import bookstoreCtrl from './controllers/bookstores.js'

import ExpressError from './utils/ExpressError.js'

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
    const error = new ExpressError(
      'The URL is not recognized by the server',
      404
    )

    return next(error)
  })

  app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err

    res.status(status).render('error.ejs', { status, message })
  })

  return app
}

// async function startApp() {
//   const PORT = process.env.PORT || 3000

//   // When testing, we're connecting to test DB in the test file there using testDBUtils.connect(), so ONLY when we're NOT testing, we actually use setupDB.connect() to connect to real database.
//   if (process.env.NODE_ENV !== 'test') {
//     connection = await setupDB.connect(
//       'mongodb://127.0.0.1:27017/bookstoreDiscovery'
//     )
//   }

//   const app = createApp(connection)

//   // Check if this file is directly run by node command, if true then make app listen at port
//   if (path.normalize(fileURLToPath(import.meta.url)) === `${process.argv[1]}`) {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`)
//     })
//   }
// }

// if (path.normalize(fileURLToPath(import.meta.url)) === `${process.argv[1]}`) {
//   startApp()
// }

async function startApp() {
  // When testing, we have to MAKE SURE of when importing our app.js implementation file inside our TEST FILE, it won't execute app.listen() and mongoose.connect() when we're running the test, because when you import this app.js file inside app.test.js, the app.js file executes AND because in our TEST FILE, we CREATE a SEPERATE CONNECTION and SEPERATE EXPRESS APP INSTANCE that uses that connection directly in the app.test.js and use supertest request(thatNewAppInstance) INSTEAD of the code that stars the app in our implementation file, if BOTH runs it CAUSE ISSUES (we only want the one in our test file to run if we run the test). We can fix this issue by in our implementation file, we check if only when path.normalize(fileURLToPath(import.meta.url)) === `${process.argv[1]}` then execute the function that starts the app. However, this is complicated, so we can just wrap every code related to starting the app inside a conditional to check if process.env.NODE_ENV !== "test", only then run the code that starts the app in the implementation file. This make it so even if app.js is imported in app.test.js, the code still won't executed, because when you run the test it automatically sets NODE_ENV === "test" for you.
  if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000

    connection = await setupDB.connect(
      'mongodb://127.0.0.1:27017/bookstoreDiscovery'
    )

    const app = createApp(connection)

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }
}

startApp()

export default createApp
