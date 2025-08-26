import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import models from '../../../models/index.js'

describe('models.Bookstore.getModelClass()', () => {
  let ModelClassMock = 'ModelClass'
  let connectionMock = {
    model: vi.fn((modelName, modelSchema) => {
      return ModelClassMock
    }),
  }
  it('when you pass a mocked connection object to it, it should call connection.model(`Bookstore`, models.Bookstore.schema)', () => {
    const res = models.Bookstore.getModelClass(connectionMock)

    expect(connectionMock.model).toBeCalledWith(
      'Bookstore',
      models.Bookstore.schema
    )
  })
  it('when you pass a mocked connection object to it, it should return a predetermined ModelClass', () => {
    const res = models.Bookstore.getModelClass(connectionMock)

    expect(res).toBe(ModelClassMock)
  })

  it("when you don't pass a connection obj to 1st param, it should throw an error", () => {
    connectionMock = [1, 2, 3]

    const fn = () => {
      models.Bookstore.getModelClass(connectionMock)
    }

    expect(fn).toThrow('First parameter must be a connection obj')
  })
})
