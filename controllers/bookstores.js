import models from '../models/index.js'
import app from '../app.js'
import dbUtils from '../utils/dbUtils.js'
import objectUtils from '../utils/objectUtils.js'
import mongoose from 'mongoose'
import catchAsync from '../utils/catchAsync.js'
import ExpressError from '../utils/ExpressError.js'

const ObjectId = mongoose.Types.ObjectId
// const renderIndexPage = async (req, res, next) => {
//   const bookstores = await Bookstore.find({})
//   res.render('./bookstore/index.ejs', { bookstores })
// }

// const renderCreatePage = (req, res, next) => {
//   res.render('./bookstore/create.ejs')
// }

// export { renderIndexPage, renderCreatePage }
const bookstoreCtrl = {
  renderIndexPage(connection) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection object')
    }
    const Bookstore = connection.model('Bookstore', models.Bookstore.schema)

    return catchAsync(async (req, res, next) => {
      const bookstores = await Bookstore.find({})

      if (bookstores.length === 0) {
        throw new ExpressError('No bookstores found', 404)
      }

      res.render('./bookstore/index.ejs', { bookstores })
    })
  },

  renderCreatePage(connection) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection object')
    }
    return (req, res, next) => {
      res.render('./bookstore/create.ejs')
    }
  },

  renderShowPage(connection) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection object')
    }
    return catchAsync(async (req, res, next) => {
      const { id } = req.params

      if (!ObjectId.isValid(id)) {
        throw new ExpressError('Invalid ID in URL', 404)
      }

      const Bookstore = connection.model('Bookstore', models.Bookstore.schema)

      const bookstore = await Bookstore.findById(id)

      res.render('./bookstore/show.ejs', { bookstore })
    })
  },
  createBookstore(connection) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('First parameter should be a connection object')
    }
    const Bookstore = connection.model('Bookstore', models.Bookstore.schema)
    return catchAsync(async (req, res, next) => {
      const newBookstore = await Bookstore.create(req.body.bookstore)

      res.redirect(`/bookstores/${newBookstore._id}`)
    })
  },
}

export default bookstoreCtrl
