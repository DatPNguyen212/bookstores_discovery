import express from 'express'
const router = express.Router()
import * as bookstoresCtrl from '../controllers/bookstores'

router.get('/new', bookstoresCtrl.renderCreatePage)

router.get('/', bookstoresCtrl.renderIndexPage)

module.exports = router
