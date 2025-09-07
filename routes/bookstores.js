import express from 'express'
// import * as bookstoresCtrl from '../controllers/bookstores.js'
import bookstoreCtrl from '../controllers/bookstores.js'

function createBookstoreRouter(connection) {
  const router = express.Router()

  const renderCreatePage = bookstoreCtrl.renderCreatePage(connection)
  const renderShowPage = bookstoreCtrl.renderShowPage(connection)
  const renderIndexPage = bookstoreCtrl.renderIndexPage(connection)
  const createBookstore = bookstoreCtrl.createBookstore(connection)

  router.get('/new', renderCreatePage)
  router.get('/:id', renderShowPage)
  router.get('/', renderIndexPage)

  router.post('/', createBookstore)

  return router
}

// router.get('/new', bookstoresCtrl.renderCreatePage)

// router.get('/', bookstoresCtrl.renderIndexPage)

export default createBookstoreRouter
