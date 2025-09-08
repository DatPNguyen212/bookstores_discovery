function catchAsync(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('First parameter should be a function.')
  }
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}

export default catchAsync
