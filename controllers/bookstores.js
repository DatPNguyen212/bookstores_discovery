import models from '../models/index.js'
import main from '../app'
const Bookstore = models.bookstore.getModelClass(main.connection)
const renderIndexPage = async (req, res, next) => {
  const bookstores = await Bookstore.find({})
  res.render('./bookstore/index.ejs', { bookstores })
}

const renderCreatePage = (req, res, next) => {
  res.render('./bookstore/create.ejs')
}

export { renderIndexPage, renderCreatePage }
