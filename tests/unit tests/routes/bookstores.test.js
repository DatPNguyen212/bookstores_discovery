import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import createBookstoreRouter from '../../../routes/bookstores.js'
import express from 'express'
import bookstoreCtrl from '../../../controllers/bookstores.js'

let renderIndexPageHandler = () => {}
let renderCreatePageHandler = () => {}

vi.mock('../../../controllers/bookstores.js', () => {
  return {
    default: {
      renderIndexPage: vi.fn((connection) => {
        return renderIndexPageHandler
      }),
      renderCreatePage: vi.fn((connection) => {
        return renderCreatePageHandler
      }),
    },
  }
})

describe('createBookstoreRouter()', () => {
  let expressRouterSpy
  let connection
  let router = {
    get: vi.fn(),
  }

  beforeEach(() => {
    expressRouterSpy = vi.spyOn(express, 'Router').mockReturnValue(router)
    connection = {
      models: {
        ModelClass: 'ModelName',
      },
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when pass a connection object, it should call express.Router()', () => {
    const res = createBookstoreRouter(connection)

    expect(expressRouterSpy).toBeCalled()
  })
  it('when pass a connection object, it should call bookstoreCtrl.renderCreatePage(connection)', () => {
    createBookstoreRouter(connection)

    expect(bookstoreCtrl.renderCreatePage).toBeCalledWith(connection)
  })
  it('when pass a connection object, it should call bookstoreCtrl.renderIndexPage(connection)', () => {
    createBookstoreRouter(connection)

    expect(bookstoreCtrl.renderIndexPage).toBeCalledWith(connection)
  })

  it('when you pass a connection obj, it should register GET `/new` route with correct route handler', () => {
    createBookstoreRouter(connection)

    expect(router.get).toBeCalledWith('/new', renderCreatePageHandler)
  })
  it('when you pass a connection obj, it should register GET `/` route with correct route handler', () => {
    createBookstoreRouter(connection)

    expect(router.get).toBeCalledWith('/', renderIndexPageHandler)
  })
  it('when you pass a connection obj, it should return router obj', () => {
    const res = createBookstoreRouter(connection)

    expect(res).toBe(router)
  })
})
