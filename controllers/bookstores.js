const renderIndexPage = (req, res, next) => {
  res.render('./bookstore/index.ejs')
}

const renderCreatePage = (req, res, next) => {
  res.render('./bookstore/create.ejs')
}

export { renderIndexPage, renderCreatePage }
