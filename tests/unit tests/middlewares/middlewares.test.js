import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import middlewares from '../../../middlewares/middlewares.js'
import bookstoreJoiSchema from '../../../joi/bookstoreSchema.js'
import ExpressError from '../../../utils/ExpressError.js'

describe('middlewares.isValidStore', () => {
  let bookstoreJoiSchemaSpy
  let validateResult
  let req
  let res
  let next
  beforeEach(() => {
    req = {
      body: {
        bookstore: {},
      },
    }
    res = {}
    next = vi.fn()
    validateResult = {
      error: new Error('test'),
    }
    bookstoreJoiSchemaSpy = vi
      .spyOn(bookstoreJoiSchema, 'validate')
      .mockReturnValue(validateResult)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call bookstoreJoiSchema.validate() with req.body', () => {
    middlewares.isValidStore(req, res, next)

    expect(bookstoreJoiSchema.validate).toBeCalledWith(req.body)
  })

  it("given there's a joi validation error, next() should be called with correct error instance of ExpressError", () => {
    validateResult = {
      error: new Error('test'),
    }
    const expressError = new ExpressError(validateResult.error.message, 400)

    middlewares.isValidStore(req, res, next)

    expect(next).toBeCalledWith(expressError)
  })
  it('given joi validation passes, next() should be called', () => {
    validateResult = {}
    bookstoreJoiSchemaSpy = vi
      .spyOn(bookstoreJoiSchema, 'validate')
      .mockReturnValue(validateResult)

    middlewares.isValidStore(req, res, next)

    expect(next).toBeCalledWith()
  })
})
