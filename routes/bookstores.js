const express = require('express')
const router = express.Router()
const bookstoresCtrl = require('../controllers/bookstores')

router.get('/new', bookstoresCtrl.renderCreatePage)

router.get('/', bookstoresCtrl.renderIndexPage)

module.exports = router
