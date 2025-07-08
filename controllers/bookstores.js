module.exports.renderIndexPage = (req, res, next) => {
  res.render('index.ejs')
}

module.exports.renderCreatePage = (req, res, next) => {
  res.render('create.ejs')
}
