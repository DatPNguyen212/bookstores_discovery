import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import dbUtils from '../../utils/dbUtils'

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
  it('when you pass the model name that exists in default connection, it should return a defined value', () => {
    const modelName = 'ModelName'

    const res = dbUtils.getModelClass(modelName)

    expect(res).toBeDefined()
  })
  it('if you pass pass a non string in first parameter, it should throw an error', () => {
    const modelName = 3

    const fn = () => {
      dbUtils.getModelClass(modelName)
    }

    expect(fn).toThrow('First parameter should be of string data type')
  })
  it('when you pass the model name that does not exist in default connection, it should return undefined', () => {
    const modelName = 'ModelName2'

    const res = dbUtils.getModelClass(modelName)

    expect(res).toBeUndefined()
  })
})

describe('dbUtils.clearCollection()', () => {
  let getModelClassSpy

  beforeEach(() => {
    getModelClassSpy = vi.spyOn(dbUtils, 'getModelClass')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it("given dbUtils.getModelClass() returns a mocked obj, when you pass an existing modelName in default connection, it should call that mocked object's deleteMany({}) method", async () => {
    const ModelClassMock = {
      deleteMany: vi.fn(),
    }
    getModelClassSpy.mockReturnValue(ModelClassMock)

    const modelName = 'ModelName'

    const res = await dbUtils.clearCollection(modelName)

    expect(ModelClassMock.deleteMany).toBeCalledWith({})
  })
})
