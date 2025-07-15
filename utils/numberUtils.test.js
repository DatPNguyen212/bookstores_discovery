import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import numberUtils from './numberUtils'

describe('numberUtils.generateRandNum()', () => {
  let mathRandomSpy

  beforeEach(() => {
    mathRandomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("given Math.random() returns 0, it should return the min parameter's value", () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0
      })
    )

    const min = 1
    const max = 5
    // act
    const res = numberUtils.generateRandNum(min, max)

    // assert
    expect(res).toBe(min)
  })

  it("given Math.random() returns 0.999, it should return the max parameter's value", () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.999
      })
    )
    const min = 1
    const max = 5
    // act
    const res = numberUtils.generateRandNum(min, max)

    // assert
    expect(res).toBe(max)
  })

  it('given Math.random() returns 0.5, min is 1 and max is 5, it should return 3', () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.5
      })
    )
    const min = 1
    const max = 5

    // act
    const res = numberUtils.generateRandNum(min, max)

    // assert
    expect(res).toBe(3)
  })

  it('should throw an error if first parameter is not number data type', () => {
    // arrange
    const min = 'test'
    const max = 3

    // act
    const fn = () => {
      numberUtils.generateRandNum(min, max)
    }
    // assert
    expect(fn).toThrow(
      'First and second parameters must be of number data type'
    )
  })

  it('should throw an error if second parameter is not number data type', () => {
    // arrange
    const min = 1
    const max = 'test'

    // act
    const fn = () => {
      numberUtils.generateRandNum(min, max)
    }
    // assert
    expect(fn).toThrow(
      'First and second parameters must be of number data type'
    )
  })
})
