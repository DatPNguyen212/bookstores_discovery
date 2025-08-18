import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import bookstoreCtrl from '../../../controllers/bookstores.js'
import dbUtils from '../../../utils/dbUtils.js'

describe('bookstoreCtrl.renderIndexPage()', () => {
  let findResult = [1, 2, 3]
  let Bookstore = {
    find: vi.fn(async () => {
      return findResult
    }),
  }
  let connection = {
    models: {
      Bookstore: Bookstore,
    },
  }
  let getModelClassSpy
  let req = {
    query: {
      test: 'test',
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
    vi.restoreAllMocks()
  })

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

// describe('bookstoreCtrl.renderCreatePage()', () => {})
