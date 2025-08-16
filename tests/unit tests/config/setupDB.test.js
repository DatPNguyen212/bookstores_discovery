import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import setupDB from '../../../config/setupDB.js'
import mongoose from 'mongoose'

describe('setupDB.connect()', () => {
  let createConnectionSpy
  let connectionObjMock
  beforeEach(() => {
    connectionObjMock = {
      asPromise: vi.fn(async () => {
        return Promise.resolve()
      }),
    }
    createConnectionSpy = vi
      .spyOn(mongoose, 'createConnection')
      .mockReturnValue(connectionObjMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('when passed uri string, it should call mongoose.createConnection() with that uri string', async () => {
    const URI = 'mongodb://127.0.0.1:27017/bookstoreDiscovery'

    const res = await setupDB.connect(URI)

    expect(createConnectionSpy).toBeCalledWith(URI)
  })

  it('given connection is successful, it should return the connection obj returned by mocked mongoose.createConnection()', async () => {
    const URI = 'test'

    const res = await setupDB.connect(URI)

    expect(res).toBe(connectionObjMock)
  })

  it('if connection is successfully made to URI you specified, it should log a success message ', async () => {
    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    const URI = 'test'

    const res = await setupDB.connect(URI)

    expect(console.log).toBeCalledWith('Successfully connected to DB')
  })

  it('if connection is not successful, it should throw an error', async () => {
    const URI = 'test'
    createConnectionSpy.mockReturnValue({
      asPromise: vi.fn(async () => {
        return Promise.reject('error')
      }),
    })

    const fn = async () => {
      await setupDB.connect(URI)
    }

    await expect(fn).rejects.toThrow('Failed to connect to DB')
  })

  it('if connection is not successful, it should log error message thrown by connection.asPromise()', async () => {
    const URI = 'test'
    createConnectionSpy.mockReturnValue({
      asPromise: vi.fn(async () => {
        return Promise.reject('error')
      }),
    })
    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    try {
      const res = await setupDB.connect(URI)
    } catch (error) {}

    expect(console.log).toBeCalledWith('error')
  })
})
