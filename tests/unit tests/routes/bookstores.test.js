import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import createBookstoreRouter from '../../../routes/bookstores.js'
import express from 'express'

describe('createBookstoreRouter()', () => {
  let expressRouterSpy
  let connection

  beforeEach(() => {
    expressRouterSpy = vi.spyOn(express, 'Router')
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
})
