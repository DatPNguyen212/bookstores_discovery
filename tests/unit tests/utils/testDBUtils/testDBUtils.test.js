import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import testDBUtils from '../../../../utils/testDBUtils/testDBUtils'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongoMemoryServerMock = {
  getUri: vi.fn(() => {
    return 'uri'
  }),
  stop: vi.fn(async () => {}),
}
vi.mock('mongodb-memory-server', () => {
  return {
    MongoMemoryServer: {
      create: vi.fn(async () => {
        return mongoMemoryServerMock
      }),
    },
  }
})

const connectionMock = {
  asPromise: vi.fn(async () => {
    return Promise.resolve()
  }),
  dropDatabase: vi.fn(),
  close: vi.fn(),
}
vi.mock('mongoose', () => {
  return {
    default: {
      createConnection: vi.fn((uri) => {
        return connectionMock
      }),
    },
  }
})

describe('testDBUtils.connect()', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should call MongoMemoryServer.create()', async () => {
    await testDBUtils.connect()

    expect(MongoMemoryServer.create).toBeCalled()
  })

  it('should call mongoMemoryServerMock.getUri()', async () => {
    await testDBUtils.connect()

    expect(mongoMemoryServerMock.getUri).toBeCalled()
  })

  it('should call mongoose.createConnection() with `uri` argument passed to it', async () => {
    await testDBUtils.connect()

    expect(mongoose.createConnection('uri'))
  })

  it('should assign this.connection and this.mongoMemoryServer with the connectionMock and mongoMemoryServerMock', async () => {
    const connectionPropertySpy = vi.spyOn(testDBUtils, 'connection', 'set')

    const mongoMemoryServerPropertySpy = vi.spyOn(
      testDBUtils,
      'mongoMemoryServer',
      'set'
    )

    await testDBUtils.connect()

    expect(connectionPropertySpy).toBeCalledWith(connectionMock)
    expect(mongoMemoryServerPropertySpy).toBeCalledWith(mongoMemoryServerMock)
  })

  it('should call testDBConnection.asPromise()', async () => {
    await testDBUtils.connect()

    expect(connectionMock.asPromise).toBeCalled()
  })

  it('if connection to mongo memory is successful, log message', async () => {
    await testDBUtils.connect()

    expect(connectionMock.asPromise).toBeCalled()
  })

  it('given connection to mongo memory is unsuccessful, and if testDBUtils.mongoMemoryServer is NOT empty, then mongoMemoryServer.stop()', async () => {
    const connectionAsPromiseSpy = vi
      .spyOn(connectionMock, 'asPromise')
      .mockImplementation(
        vi.fn(async () => {
          return Promise.reject()
        })
      )

    try {
      await testDBUtils.connect()
    } catch (error) {}

    expect(mongoMemoryServerMock.stop).toBeCalled()
  })

  it('given connection to mongo memory is unsuccessful, testDBUtils.connection and testDBUtils.mongoMemoryServer are assigned null', async () => {
    const connectionAsPromiseSpy = vi
      .spyOn(connectionMock, 'asPromise')
      .mockImplementation(
        vi.fn(async () => {
          return Promise.reject()
        })
      )

    const connectionSetPropertySpy = vi.spyOn(testDBUtils, 'connection', 'set')

    const mongoMemoryServerSetPropertySpy = vi.spyOn(
      testDBUtils,
      'mongoMemoryServer',
      'set'
    )

    try {
      await testDBUtils.connect()
    } catch (error) {}

    expect(connectionSetPropertySpy).toBeCalledWith(null)
    expect(mongoMemoryServerSetPropertySpy).toBeCalledWith(null)
  })
  it('given connection to mongo memory is unsuccessful, it should throw an error', async () => {
    const connectionAsPromiseSpy = vi
      .spyOn(connectionMock, 'asPromise')
      .mockImplementation(
        vi.fn(async () => {
          return Promise.reject()
        })
      )

    const fn = async () => {
      await testDBUtils.connect()
    }

    await expect(fn).rejects.toThrow('Failed to connect to mongo memory server')
  })
  it('given connection to mongo memory is successful, it should return connectionMock', async () => {
    const res = await testDBUtils.connect()

    expect(res).toEqual(connectionMock)
  })
})

describe('testDBUtils.clearDB()', () => {
  let connectionPropertySpy

  beforeEach(() => {
    connectionPropertySpy = vi.spyOn(testDBUtils, 'connection', 'get')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should throw an error if testDBUtils.connection is falsy', async () => {
    connectionPropertySpy.mockReturnValue(false)

    const fn = async () => {
      await testDBUtils.clearDB()
    }

    await expect(fn).rejects.toThrow('Connection not established')
  })

  it("given you're connected to mongo memory server, it should call deleteMany() methods of all the models inside the connection property of testDBUtils", async () => {
    connectionPropertySpy.mockReturnValue({
      readyState: 1,
      models: {
        ModelClass1: {
          deleteMany: vi.fn(),
        },
        ModelClass2: {
          deleteMany: vi.fn(),
        },
      },
    })

    await testDBUtils.clearDB()

    expect(testDBUtils.connection.models.ModelClass1.deleteMany).toBeCalled()
    expect(testDBUtils.connection.models.ModelClass2.deleteMany).toBeCalled()
  })
  it('if testDBUtils.connection.readyState is 0, it should throw an error', async () => {
    connectionPropertySpy.mockReturnValue({
      readyState: 0,
    })

    const fn = async () => {
      await testDBUtils.clearDB()
    }

    await expect(fn).rejects.toThrow(
      'Not connected to mongo memory server, so cannot clear database'
    )
  })
  it('if testDBUtils.connection.readyState is 2, it should throw an error', async () => {
    connectionPropertySpy.mockReturnValue({
      readyState: 2,
    })

    const fn = async () => {
      await testDBUtils.clearDB()
    }

    await expect(fn).rejects.toThrow(
      'Not connected to mongo memory server, so cannot clear database'
    )
  })
  it('if testDBUtils.connection.readyState is 3, it should throw an error', async () => {
    connectionPropertySpy.mockReturnValue({
      readyState: 3,
    })

    const fn = async () => {
      await testDBUtils.clearDB()
    }

    await expect(fn).rejects.toThrow(
      'Not connected to mongo memory server, so cannot clear database'
    )
  })
  it('if testDBUtils.connection.readyState is 4, it should throw an error', async () => {
    connectionPropertySpy.mockReturnValue({
      readyState: 4,
    })

    const fn = async () => {
      await testDBUtils.clearDB()
    }

    await expect(fn).rejects.toThrow(
      'Not connected to mongo memory server, so cannot clear database'
    )
  })
})
