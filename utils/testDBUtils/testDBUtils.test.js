import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import testDBUtils from './testDBUtils'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongoMemoryServerMock = {
  getUri: vi.fn(() => {
    return 'uri'
  }),
}

vi.mock('mongodb-memory-server', () => {
  return {
    MongoMemoryServer: {
      create: vi.fn(async () => {
        return Promise.resolve(mongoMemoryServerMock)
      }),
    },
  }
})

const testDBConnectionMock = {
  asPromise: vi.fn(async () => {}),
}

vi.mock('mongoose', () => {
  return {
    default: {
      createConnection: vi.fn((uri) => {
        return testDBConnectionMock
      }),
    },
  }
})

describe('testDBUtils.connect()', () => {
  it('should call MongoMemoryServer.create() to return mongoMemoryServerMock', async () => {
    await testDBUtils.connect()

    expect(MongoMemoryServer.create).toBeCalled()
  })
  it("should call mongoMemoryServerMock.getUri() to get memory server instance's uri", async () => {
    await testDBUtils.connect()

    expect(mongoMemoryServerMock.getUri).toBeCalled()
  })
  it('should call mongoose.createConnection() with the URI returned by the mongoMemoryServerMock.getUri()', async () => {
    await testDBUtils.connect()

    expect(mongoose.createConnection).toBeCalledWith('uri')
  })
  it('should wait for the connection to memory server is established by calling testDBCollectionMock.onPromise()', async () => {
    await testDBUtils.connect()

    expect(testDBConnectionMock.asPromise).toBeCalled()
  })
  it('should log to console when the connection to mongo memory server is established', async () => {
    const consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(vi.fn((message) => {}))

    await testDBUtils.connect()

    expect(console.log).toBeCalledWith(
      'Successfully connected to mongo memory server'
    )

    consoleLogSpy.mockRestore()
  })
  it('should return testDBConnectionMock', async () => {
    await expect(testDBUtils.connect()).resolves.toEqual(testDBConnectionMock)
  })
})

describe('testDBUtils.clearDB()', () => {
  it('when pass a connection object to it, it should call all the deleteMany({}) methods of all ModelClasses inside connection.models', async () => {
    const connection = {
      models: {
        ModelClass1: {
          deleteMany: vi.fn(async (query) => {}),
        },
        ModelClass2: {
          deleteMany: vi.fn(async (query) => {}),
        },
      },
    }

    await testDBUtils.clearDB(connection)

    expect(connection.models.ModelClass1.deleteMany).toBeCalledWith({})
    expect(connection.models.ModelClass2.deleteMany).toBeCalledWith({})
  })

  it('when you pass an array, it should throw an error', async () => {
    const connection = [1, 2, 3]

    const fn = async () => {
      await testDBUtils.clearDB(connection)
    }

    await expect(fn).rejects.toThrow('First parameter must be a plain object')
  })

  it('when you pass a number, it should throw an error', async () => {
    const connection = 3

    const fn = async () => {
      await testDBUtils.clearDB(connection)
    }

    await expect(fn).rejects.toThrow('First parameter must be a plain object')
  })
  it('when you pass a string, it should throw an error', async () => {
    const connection = '3'

    const fn = async () => {
      await testDBUtils.clearDB(connection)
    }

    await expect(fn).rejects.toThrow('First parameter must be a plain object')
  })
  it('when you pass a FALSY value, it should throw an error', async () => {
    const connection = NaN

    const fn = async () => {
      await testDBUtils.clearDB(connection)
    }

    await expect(fn).rejects.toThrow('First parameter must be a plain object')
  })
})

describe('testDBUtils.closeDB()', () => {
  let connection
  let mongoMemoryServer
  beforeEach(() => {
    connection = {
      dropDatabase: vi.fn(async () => {}),
    }
    mongoMemoryServer = {
      stop: vi.fn(async () => {}),
    }
  })
  it('when pass a connection object in first parameter and mongo memory server instance in second parameter, it should call connection.dropDatabase() and mongoMemoryServer.stop()', async () => {
    await testDBUtils.closeDB(connection, mongoMemoryServer)

    expect(connection.dropDatabase).toBeCalled()
    expect(mongoMemoryServer.stop).toBeCalled()
  })
})
