import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import arrayUtils from '../../../utils/arrayUtils'
import lodash from 'lodash'

describe('arrayUtils.getRandItem()', () => {
  let mathRandomSpy

  beforeEach(() => {
    mathRandomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('given Math.random() returns 0, when an array is passed to it, it should return 0 index item in the array', () => {
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0
      })
    )

    const array = [1, 2, 3]

    const res = arrayUtils.getRandItem(array)

    expect(res).toBe(1)
  })

  it('given Math.random() returns 0.999, when an array is passed to it, it should return the last index item in the array', () => {
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.999
      })
    )

    const array = [1, 2, 3]

    const res = arrayUtils.getRandItem(array)

    expect(res).toBe(3)
  })

  it('given Math.random() returns 0.6, when a 3 items array is passed to it, it should return the 1st index item in the array', () => {
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0.6
      })
    )

    const array = [1, 2, 3]

    const res = arrayUtils.getRandItem(array)

    expect(res).toBe(2)
  })

  it('should throw an error if first parameter is not array data type', () => {
    const array = 3

    const fn = () => {
      arrayUtils.getRandItem(array)
    }

    expect(fn).toThrow('First parameter should be of array data type')
  })
})

describe('arrayUtils.generateArray()', () => {
  let mathRandomSpy

  beforeEach(() => {
    mathRandomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('when pass {numberItems: 3, enum: [1,2,3]}, it should return an array that contains 3 items', () => {
    const option = { numberItems: 3, enum: [1, 2, 3] }

    const res = arrayUtils.generateArray(option)

    expect(res.length).toBe(3)
  })
  it('given Math.random() returns 0, when pass {numberItems: 3, enum: [1, 2, 3]}, it should return an array where each item can only be 1', () => {
    mathRandomSpy.mockImplementation(
      vi.fn(() => {
        return 0
      })
    )
    const option = { numberItems: 3, enum: [1, 2, 3] }

    const res = arrayUtils.generateArray(option)

    for (let item of res) {
      expect(item).toBe(1)
    }
  })
  it('when pass {numberItems: 3, default: 3}, it should return an array where each item can only be 3', () => {
    const option = { numberItems: 3, default: 3 }

    const res = arrayUtils.generateArray(option)

    for (let item of res) {
      expect(item).toBe(3)
    }
  })

  it('when pass {numberItems: 3} with no default or enum, it should throw an error', () => {
    const option = { numberItems: 3 }

    const fn = () => {
      arrayUtils.generateArray(option)
    }

    expect(fn).toThrow(
      'First object parameter must have enum property OR default property'
    )
  })

  it('when pass option object with numberItems, enum, default properties; it should throw an error', () => {
    const option = { numberItems: 3, default: 3, enum: [1, 2, 3] }

    const fn = () => {
      arrayUtils.generateArray(option)
    }

    expect(fn).toThrow(
      'First object parameter CANNOT have both default property and enum property'
    )
  })

  it("when option object doesn't have numberItems property; it should throw an error", () => {
    const option = { default: 3, enum: [1, 2, 3] }

    const fn = () => {
      arrayUtils.generateArray(option)
    }

    expect(fn).toThrow('First object parameter MUST have numberItems property')
  })
  it('if enum is not array, it should throw an error', () => {
    const option = { numberItems: 3, enum: 3 }

    const fn = () => {
      arrayUtils.generateArray(option)
    }

    expect(fn).toThrow('enum property must be an array')
  })

  it('given Math.random() returns a predetermined value everytime it is called, when you pass {numberItems: 2, enum: [1,2], uniqueItems: true}, it should call arrayUtils.getRandItem() correct amount of times to get an array whose values are unique and are from enum array', () => {
    mathRandomSpy.mockReturnValueOnce(0)
    mathRandomSpy.mockReturnValueOnce(0.1)
    mathRandomSpy.mockReturnValueOnce(0.99)
    const getRandItemSpy = vi.spyOn(arrayUtils, 'getRandItem')

    const option = {
      numberItems: 2,
      enum: [1, 2],
      uniqueItems: true,
    }

    const res = arrayUtils.generateArray(option)

    expect(getRandItemSpy).toBeCalledTimes(3)
    expect(res).toEqual([1, 2])
  })

  it('given option object arguemnt with numberItems, enum and uniqeItems true, when numberItems is larger than enum array length, it should throw an error', () => {
    const option = {
      numberItems: 4,
      enum: [1, 2],
      uniqueItems: true,
    }

    const fn = () => {
      arrayUtils.generateArray(option)
    }

    expect(fn).toThrow(
      "numberItems should be smaller than or equal to enum array's length"
    )
  })
})
