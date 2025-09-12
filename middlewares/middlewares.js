import bookstoreJoiSchema from '../joi/bookstoreSchema.js'
import ExpressError from '../utils/ExpressError.js'
const middlewares = {
  isValidStore(req, res, next) {
    const { error } = bookstoreJoiSchema.validate(req.body)

    if (error) {
      const expressError = new ExpressError(error.message, 400)
      return next(expressError)
    } else {
      return next()
    }
  },
}

export default middlewares
