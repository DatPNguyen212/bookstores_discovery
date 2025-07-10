const renderIndexPage = (req, res, next) => {
  res.render('index.ejs')
}

const renderCreatePage = (req, res, next) => {
  res.render('create.ejs')
}

export { renderIndexPage, renderCreatePage }
