import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import dbUtils from '../../utils/dbUtils.js'

vi.mock('mongoose', () => {
  return {
    default: {
      connection: {
        models: {
          ModelName: {
            deleteMany: vi.fn(),
          },
        },
      },
    },
  }
})

describe('dbUtils.getModelClass()', () => {
  let connectionMock = {
    models: {
      ModelName: {
        deleteMany: vi.fn(),
      },
    },
  }

  it('when you pass a connection in 1st param, and a model name that exists in that connection in 2nd param, it should return a defined value', () => {
    const modelName = 'ModelName'

    const res = dbUtils.getModelClass(connectionMock, modelName)

    expect(res).toBeDefined()
  })
  it('if you pass a non-string data type to 2nd parameter, it should throw an error', () => {
    const modelName = 3

    const fn = () => {
      dbUtils.getModelClass(connectionMock, modelName)
    }

    expect(fn).toThrow('Second parameter should be of string data type')
  })
  it('when you pass the model name that does not exist in default connection, it should return undefined', () => {
    const modelName = 'ModelName2'

    const res = dbUtils.getModelClass(connectionMock, modelName)

    expect(res).toBeUndefined()
  })
  it('when you pass a non-plain object in first param, it should throw an error', () => {
    const modelName = 'ModelName'
    connectionMock = 'connection'

    const fn = () => {
      dbUtils.getModelClass(connectionMock, modelName)
    }

    expect(fn).toThrow('First parameter should be a connection object')
  })
})

describe('dbUtils.clearCollection()', () => {
  let getModelClassSpy
  let connectionMock = {
    models: {
      ModelName: {
        deleteMany: vi.fn(),
      },
    },
  }

  beforeEach(() => {
    getModelClassSpy = vi.spyOn(dbUtils, 'getModelClass')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it("given dbUtils.getModelClass() returns a mocked obj, when you pass a connection obj in 1st param, and an existing modelName in that connection in 2nd param, it should call that mocked object's deleteMany({}) method", async () => {
    const ModelClassMock = {
      deleteMany: vi.fn(),
    }
    getModelClassSpy.mockReturnValue(ModelClassMock)
    const modelName = 'ModelName'

    const res = await dbUtils.clearCollection(connectionMock, modelName)

    expect(ModelClassMock.deleteMany).toBeCalledWith({})
  })
  it('when pass a non string data type for second param, it should throw an error', async () => {
    const modelName = 3

    const fn = async () => {
      await dbUtils.clearCollection(connectionMock, modelName)
    }

    await expect(fn).rejects.toThrow(
      'Second parameter should be of string data type'
    )
  })
  it('when you pass a non-plain object to 1st param, it should throw an error', async () => {
    const modelName = 'ModelName'
    connectionMock = 'connection'

    const fn = async () => {
      await dbUtils.clearCollection(connectionMock, modelName)
    }

    await expect(fn).rejects.toThrow(
      'First parameter should be a connection object'
    )
  })
})
