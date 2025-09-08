import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import bookstoreCtrl from '../../../controllers/bookstores.js'
import dbUtils from '../../../utils/dbUtils.js'
import models from '../../../models/index.js'
import mongoose from 'mongoose'
import ExpressError from '../../../utils/ExpressError.js'

const ObjectId = mongoose.Types.ObjectId

describe('bookstoreCtrl', () => {
  let findResult = [1, 2, 3]
  let findByIdResult = {
    name: 'bookstoreName',
    address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
    description: 'test',
    genres: ['fantasy', 'science'],
    images: 'url',
    openDays: ['Monday', 'Tuesday'],
  }

  let newBookstore = {
    _id: new ObjectId(),
    name: 'bookstoreName',
    address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
    description: 'test',
    genres: ['fantasy', 'science'],
    images: 'url',
    openDays: ['Monday', 'Tuesday'],
  }
  let Bookstore = {
    find: vi.fn(async () => {
      return findResult
    }),
    findById: vi.fn(async () => {
      return findByIdResult
    }),
    create: vi.fn(async () => {
      return newBookstore
    }),
  }
  let connection = {
    models: {
      Bookstore: Bookstore,
    },
    model: vi.fn((modelName, schema) => {
      return Bookstore
    }),
  }
  // let getModelClassSpy

  let req = {
    query: {
      test: 'test',
    },
    params: {
      id: new ObjectId(),
    },
    body: {
      bookstore: {
        name: 'bookstoreName',
        address: '3, Ba Thang Hai Street, 3 District, Ho Chi Minh City',
        description: 'test',
        genres: ['fantasy', 'science'],
        images: 'url',
        openDays: ['Monday', 'Tuesday'],
      },
    },
  }
  let res = {
    render: vi.fn(() => {}),
    redirect: vi.fn(() => {}),
  }

  let next = vi.fn()
  beforeEach(() => {
    // getModelClassSpy = vi
    //   .spyOn(dbUtils, 'getModelClass')
    //   .mockReturnValue(Bookstore)
  })

  afterEach(() => {
    connection = {
      models: {
        Bookstore: Bookstore,
      },
      model: vi.fn((modelName, schema) => {
        return Bookstore
      }),
    }

    req.params.id = new ObjectId()

    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe('bookstoreCtrl.renderIndexPage()', () => {
    it('when you pass connection obj, it should return a function', () => {
      const result = bookstoreCtrl.renderIndexPage(connection)

      expect(result).toBeInstanceOf(Function)
    })
    it('should call connection.model(`Bookstore`, models.Bookstore.schema)', () => {
      const result = bookstoreCtrl.renderIndexPage(connection)

      expect(connection.model).toBeCalledWith(
        'Bookstore',
        models.Bookstore.schema
      )
    })
    it('the return function should call Bookstore.find({})', () => {
      const returnFn = bookstoreCtrl.renderIndexPage(connection)

      returnFn(req, res, next)

      expect(Bookstore.find).toBeCalledWith({})
    })

    it('the return function should call res.render() with correct arguments', async () => {
      const returnFn = bookstoreCtrl.renderIndexPage(connection)

      await returnFn(req, res, next)

      expect(res.render).toBeCalledWith('./bookstore/index.ejs', {
        bookstores: findResult,
      })
    })

    it('if you pass a non plain obj, it should throw an error', () => {
      connection = [1, 2, 3]
      const fn = () => {
        bookstoreCtrl.renderIndexPage(connection)
      }

      expect(fn).toThrow('First parameter should be a connection object')
    })
  })

  describe('bookstoreCtrl.renderCreatePage()', () => {
    it('when you pass a connection obj, it should return a function', () => {
      const res = bookstoreCtrl.renderCreatePage(connection)

      expect(res).toBeInstanceOf(Function)
    })

    it('the return function should call res.render() with the correct arugments', async () => {
      const returnFn = bookstoreCtrl.renderCreatePage(connection)

      await returnFn(req, res, next)

      expect(res.render).toBeCalledWith('./bookstore/create.ejs')
    })

    it('when you pass a non plain obj to it, it should throw an error', () => {
      connection = [1, 2, 3]

      const fn = () => {
        bookstoreCtrl.renderCreatePage(connection)
      }

      expect(fn).toThrow('First parameter should be a connection object')
    })
  })

  describe('bookstoreCtrl.renderShowPage()', () => {
    it('when you pass a connection obj, it should return a function', () => {
      const result = bookstoreCtrl.renderShowPage(connection)

      expect(result).toBeInstanceOf(Function)
    })
    it('the return function should call res.render() with correct view file and findById result', async () => {
      const renderShowPage = bookstoreCtrl.renderShowPage(connection)

      await renderShowPage(req, res, next)

      expect(res.render).toBeCalledWith('./bookstore/show.ejs', {
        bookstore: findByIdResult,
      })
    })

    it('if req.params.id is NOT valid ObjectId, the return function should call next() with correct ExpressError object instance', async () => {
      req.params.id = 'invalidId'
      const renderShowPage = bookstoreCtrl.renderShowPage(connection)
      const expressError = new ExpressError('Invalid ID in URL', 404)

      await renderShowPage(req, res, next)

      expect(next).toBeCalledWith(expressError)
    })
    it('if you pass a non object, it should throw an error', () => {
      const connection = 3

      const fn = () => {
        bookstoreCtrl.renderShowPage(connection)
      }

      expect(fn).toThrow('First parameter should be a connection object')
    })
  })

  describe('bookstoreCtrl.createBookstore()', () => {
    it('when you pass a connection obj, should return a function', () => {
      const result = bookstoreCtrl.createBookstore(connection)

      expect(result).toBeInstanceOf(Function)
    })

    it('should call connection.model(`Bookstore`, models.Bookstore.schema)', () => {
      const result = bookstoreCtrl.createBookstore(connection)

      expect(connection.model).toBeCalledWith(
        'Bookstore',
        models.Bookstore.schema
      )
    })
    it('the return function when called should call Bookstore.create(req.body.bookstore)', async () => {
      const returnFn = bookstoreCtrl.createBookstore(connection)

      await returnFn(req, res, next)

      expect(Bookstore.create).toBeCalled(req.body.bookstore)
    })

    it('the return function when called should call res.redirect(/bookstores/id) where id is the id of the newly created bookstore doc', async () => {
      const returnFn = bookstoreCtrl.createBookstore(connection)

      await returnFn(req, res, next)

      expect(res.redirect).toBeCalledWith(`/bookstores/${newBookstore._id}`)
    })

    it('if you pass a non plain obj, it should throw an error', () => {
      const connection = 3

      const fn = () => {
        bookstoreCtrl.createBookstore(connection)
      }

      expect(fn).toThrow('First parameter should be a connection object')
    })
  })
})
