import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import mongoose, { model } from 'mongoose'
import dbUtils from '../../../utils/dbUtils.js'
import models from '../../../models/index.js'

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
      model: vi.fn(),
      Schema: vi.fn(),
    },
  }
})

// describe('dbUtils.getModelClass()', () => {
//   let connectionMock = {
//     models: {
//       ModelName: {
//         deleteMany: vi.fn(),
//       },
//     },
//   }

//   it('when you pass a connection in 1st param, and a model name that exists in that connection in 2nd param, it should return a defined value', () => {
//     const modelName = 'ModelName'

//     const res = dbUtils.getModelClass(connectionMock, modelName)

//     expect(res).toBeDefined()
//   })
//   it('when you pass a connection in 1st param, and a model name that DOES NOT EXIST in that connection in 2nd param, it should throw an error', () => {
//     const modelName = 'ModelName2'

//     const fn = () => {
//       dbUtils.getModelClass(connectionMock, modelName)
//     }

//     expect(fn).toThrow(
//       "Wrong modelName or the ModelClass you're looking for doesn't exist"
//     )
//   })
//   it('if you pass a non-string data type to 2nd parameter, it should throw an error', () => {
//     const modelName = 3

//     const fn = () => {
//       dbUtils.getModelClass(connectionMock, modelName)
//     }

//     expect(fn).toThrow('Second parameter should be of string data type')
//   })

//   it('when you pass a non-plain object in first param, it should throw an error', () => {
//     const modelName = 'ModelName'
//     connectionMock = 'connection'

//     const fn = () => {
//       dbUtils.getModelClass(connectionMock, modelName)
//     }

//     expect(fn).toThrow('First parameter should be a connection object')
//   })
// })

describe('dbUtils.clearCollection()', () => {
  let connectionMock
  let ModelClassMock = {
    deleteMany: vi.fn(async () => {}),
  }
  let modelsGetModelClassSpy

  beforeEach(() => {
    connectionMock = {
      models: {
        ModelName: {
          deleteMany: vi.fn(() => {}),
        },
      },
      model: vi.fn((modelName, schema) => {
        return ModelClassMock
      }),
    }

    modelsGetModelClassSpy = vi
      .spyOn(models, 'Bookstore', 'get')
      .mockReturnValue({
        getModelClass: vi.fn(() => {
          return ModelClassMock
        }),
      })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('when you pass connection obj, models dependency, and modelName  it should call ModelClassMock.deleteMany()', async () => {
    const modelName = 'Bookstore'

    await dbUtils.clearCollection(connectionMock, models, modelName)

    expect(modelsGetModelClassSpy).toBeCalled()
  })
  it('when you pass a non-plain obj in 1st param, it should throw an error', async () => {
    connectionMock = 3
    const modelName = 'Bookstore'

    const fn = async () => {
      await dbUtils.clearCollection(connectionMock, models, modelName)
    }

    await expect(fn).rejects.toThrow(
      'First parameter should be a connection obj'
    )
  })
  it('when you pass a non-plain obj in 2nd param, it should throw an error', async () => {
    const modelName = 'Bookstore'
    const modelsMock = 3

    const fn = async () => {
      await dbUtils.clearCollection(connectionMock, modelsMock, modelName)
    }

    await expect(fn).rejects.toThrow(
      'Second parameter should be a models dependency obj'
    )
  })

  it('when you pass a non-string argument in 3rd param, it should throw an error', async () => {
    const modelName = 3

    const fn = async () => {
      await dbUtils.clearCollection(connectionMock, models, modelName)
    }

    await expect(fn).rejects.toThrow(
      'Third parameter should be a modelName string'
    )
  })
})
