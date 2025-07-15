import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import testDBUtils from './testDBUtils'

vi.mock('mongoose', () => {
  return {
    default: {
      connect: vi.fn(async () => {}),
      connection: {
        models: {
          ModelClass1: {
            deleteMany: vi.fn(async () => {}),
          },
          ModelClass2: {
            deleteMany: vi.fn(async () => {}),
          },
        },
        close: vi.fn(),
      },
    },
  }
})

const mongoServerMock = {
  stop: vi.fn(async () => {}),
  getUri: vi.fn(() => {
    return 'uri'
  }),
}

vi.mock('mongodb-memory-server', () => {
  return {
    MongoMemoryServer: {
      create: vi.fn(async () => {
        return Promise.resolve(mongoServerMock)
      }),
    },
  }
})

describe('testDBUtils.connect()', () => {
  it('should call MongoMemoryServer.create()', async () => {
    await testDBUtils.connect()

    expect(MongoMemoryServer.create).toBeCalled()
  })
  it('should call mongoServerMock.getUri()', async () => {
    await testDBUtils.connect()

    expect(mongoServerMock.getUri).toBeCalled()
  })
  it('should call mongoose.connect() with uri string returned from mongoServerMock.getUri()', async () => {
    await testDBUtils.connect()

    expect(mongoose.connect).toBeCalledWith('uri')
  })

  it('given mongoose.connection.readyState = 1, it should call mongoose.connection.close()', async () => {
    mongoose.connection.readyState = 1

    await testDBUtils.connect()

    expect(mongoose.connection.close).toBeCalled()
  })
})

describe('testDBUtils.deleteAllCollections()', () => {
  it('when pass a mongoose connection object to it, it should call every ModelClass.deleteMany({}) in the models property', async () => {
    const connection = mongoose.connection

    await testDBUtils.deleteAllCollections(connection)

    const modelsKeys = Object.keys(connection.models)

    for (let key of modelsKeys) {
      expect(connection.models[key].deleteMany).toBeCalledWith({})
    }
  })
})
