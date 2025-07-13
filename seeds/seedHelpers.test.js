import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import seedHelpers from './seedHelpers'

describe('seedHelpers.generateRandNum()', () => {
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
    const res = seedHelpers.generateRandNum(min, max)

    // assert
    expect(res).toBe(min)
  })

  it("given Math.random() returns 0.9, it should return the max parameter's value", () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.9
      })
    )
    const min = 1
    const max = 5
    // act
    const res = seedHelpers.generateRandNum(min, max)

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
    const res = seedHelpers.generateRandNum(min, max)

    // assert
    expect(res).toBe(3)
  })

  it('should throw an error if first parameter is not number data type', () => {
    // arrange
    const min = 'test'
    const max = 3

    // act
    const fn = () => {
      seedHelpers.generateRandNum(min, max)
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
      seedHelpers.generateRandNum(min, max)
    }
    // assert
    expect(fn).toThrow(
      'First and second parameters must be of number data type'
    )
  })
})

describe('seedHelpers.generateRandName()', () => {
  let mathRandomSpy

  beforeEach(() => {
    mathRandomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('given Math.random() returns 0, it should take the 0 index item in each of the 2 array arguments and return concatenated string with space between of them', () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0
      })
    )
    const firstNames = ['a', 'b', 'c']
    const lastNames = ['a', 'b', 'c']

    // act
    const res = seedHelpers.generateRandName(firstNames, lastNames)
    // assert

    expect(res).toBe('a a')
  })

  it('given Math.random() returns 0.9, it should take the last index item in each of the 2 array arguments and return the concatenated string with space between of them', () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.9
      })
    )
    const firstNames = ['a', 'b', 'c']
    const lastNames = ['a', 'b', 'c']
    // act
    const res = seedHelpers.generateRandName(firstNames, lastNames)
    // assert
    expect(res).toBe('c c')
  })

  it('given Math.random() returns 0.6 and the length of the 2 array arguments is 3, it should return a concatenated string with space between of the 2nd index item of the 2 array parameters', () => {
    // arrange
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.6
      })
    )
    const firstNames = ['a', 'b', 'c']
    const lastNames = ['a', 'b', 'c']
    // act
    const res = seedHelpers.generateRandName(firstNames, lastNames)
    // assert
    expect(res).toBe('b b')
  })

  it('should throw an error if first parameter is not an array', () => {
    const firstNames = 'a'
    const lastNames = ['b']

    const fn = () => {
      seedHelpers.generateRandName(firstNames, lastNames)
    }

    expect(fn).toThrow('First and second parameters must be an array')
  })

  it('should throw an error if second parameter is not an array', () => {
    const firstNames = ['a']
    const lastNames = 'b'

    const fn = () => {
      seedHelpers.generateRandName(firstNames, lastNames)
    }

    expect(fn).toThrow('First and second parameters must be an array')
  })

  it('should throw an error if first array argument contains contains atleast one item that is NOT of string data type', () => {
    const firstNames = ['a', 2, 'b']
    const lastNames = ['b']

    const fn = () => {
      seedHelpers.generateRandName(firstNames, lastNames)
    }

    expect(fn).toThrow(
      'First parameter array must only contain string data type'
    )
  })
  it('should throw an error if second array argument contains contains atleast one item that is NOT of string data type', () => {
    const firstNames = ['a']
    const lastNames = ['a', 2, 'b']

    const fn = () => {
      seedHelpers.generateRandName(firstNames, lastNames)
    }

    expect(fn).toThrow(
      'Second parameter array must only contain string data type'
    )
  })
})
