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

  it('when you pass a non-string value, it should throw an error', async () => {
    const URI = 1

    const fn = async () => {
      await setupDB.connect(URI)
    }

    await expect(fn).rejects.toThrow(
      'You must pass string data type to first parameter'
    )
  })
})

describe('setupDB.close()', () => {
  it('when you pass a connection obj that has connected state, it should call that obj close method', async () => {
    const connection = {
      readyState: 1,
      close: vi.fn(),
    }
    await setupDB.close(connection)

    expect(connection.close).toBeCalled()
  })
  it('when connection state is not connected, it should log an error message', async () => {
    const connection = {
      readyState: 0,
      close: vi.fn(),
    }
    vi.stubGlobal('console', {
      log: vi.fn(),
    })

    try {
      await setupDB.close(connection)
    } catch (error) {}

    expect(console.log).toBeCalledWith(
      'There must be a connection before you can close it.'
    )
  })
  it('when connection state is not connected, it should throw an error', async () => {
    const connection = {
      readyState: 0,
      close: vi.fn(),
    }

    const fn = async () => {
      await setupDB.close(connection)
    }

    await expect(fn).rejects.toThrow(
      'There must be a connection before you can close it.'
    )
  })
  it('when you pass a value that is not obj data type, it should throw an error', async () => {
    const connection = [1, 2, 3]

    const fn = async () => {
      await setupDB.close(connection)
    }

    await expect(fn).rejects.toThrow(
      'You must pass a connection obj to first parameter'
    )
  })
})
