import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import bookstoreCtrl from '../../../controllers/bookstores.js'
import dbUtils from '../../../utils/dbUtils.js'
import models from '../../../models/index.js'
import mongoose from 'mongoose'

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
  let Bookstore = {
    find: vi.fn(async () => {
      return findResult
    }),
    findById: vi.fn(async () => {
      return findByIdResult
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
  let getModelClassSpy
  let req = {
    query: {
      test: 'test',
    },
    params: {
      id: new ObjectId(),
    },
  }
  let res = {
    render: vi.fn(() => {}),
  }

  let next = vi.fn()
  beforeEach(() => {
    getModelClassSpy = vi
      .spyOn(dbUtils, 'getModelClass')
      .mockReturnValue(Bookstore)
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
      const res = bookstoreCtrl.renderIndexPage(connection)

      expect(res).toBeInstanceOf(Function)
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

    it('the return function should throw an error if id param is not valid ObjectId', async () => {
      req.params.id = 'invalidId'
      const renderShowPage = bookstoreCtrl.renderShowPage(connection)

      const fn = async () => {
        await renderShowPage(req, res, next)
      }

      await expect(fn).rejects.toThrow('Invalid ID in URL')
    })
  })
})
