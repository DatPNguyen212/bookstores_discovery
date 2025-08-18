import models from '../models/index.js'
import app from '../app.js'
import dbUtils from '../utils/dbUtils.js'
import objectUtils from '../utils/objectUtils.js'
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
    const Bookstore = dbUtils.getModelClass(connection, 'Bookstore')

    return async (req, res, next) => {
      const bookstores = await Bookstore.find({})
      res.render('./bookstore/index.ejs', { bookstores })
    }
  },

  renderCreatePage(connection) {
    if (!objectUtils.isPlainObject(connection)) {
      throw new TypeError('FIrst parameter should be a connection object')
    }
    return async (req, res, next) => {
      res.render('./bookstore/create.ejs')
    }
  },
}

export default bookstoreCtrl
