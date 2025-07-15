import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import arrayUtils from './arrayUtils'

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
