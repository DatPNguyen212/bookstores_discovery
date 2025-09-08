import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import catchAsync from '../../../utils/catchAsync.js'

describe('catchAsync()', () => {
  let nextMock
  let reqMock
  let resMock

  beforeEach(() => {
    nextMock = vi.fn()
    reqMock = {}
    resMock = {}
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass a function, it should return a function', () => {
    const fn = () => {}

    const result = catchAsync(fn)

    expect(result).toBeInstanceOf(Function)
  })

  it('when you pass a function that returns promise of resolve, the return function when called, should call the function you passed', () => {
    const fn = vi.fn(async () => {
      return Promise.resolve()
    })

    const resultFn = catchAsync(fn)
    resultFn()

    expect(fn).toBeCalled()
  })

  it('when you pass a function that returns promise that rejects to a mockedError, the return function when called should call next(mockedError)', async () => {
    const mockedError = 'error'
    const fn = vi.fn(async (req, res, next) => {
      return Promise.reject(mockedError)
    })

    const resultFn = catchAsync(fn)
    const result = await resultFn(reqMock, resMock, nextMock)

    expect(nextMock).toBeCalledWith(mockedError)
  })
  it('when you pass a non function argument, it should throw an error', () => {
    const fnMocked = 3

    const fn = () => {
      catchAsync(fnMocked)
    }

    expect(fn).toThrow('First parameter should be a function.')
  })
})
