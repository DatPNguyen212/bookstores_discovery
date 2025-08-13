import models from '../models/index.js'
const Bookstore = models.bookstore.ModelClass
const renderIndexPage = async (req, res, next) => {
  const bookstores = await Bookstore.find({})
  res.render('./bookstore/index.ejs', { bookstores })
}

const renderCreatePage = (req, res, next) => {
  res.render('./bookstore/create.ejs')
}

export { renderIndexPage, renderCreatePage }
