import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import arrayUtils from '../../../utils/arrayUtils'
import lodash from 'lodash'

describe('arrayUtils.isValueInArray()', () => {
  it('when pass 1 in 1st param and [1,2,3] in 2nd param, if value is in array, it should return true', () => {
    const value = 1
    const array = [1, 2, 3]

    const res = arrayUtils.isValueInArray(value, array)

    expect(res).toBe(true)
  })
  it('when pass a string in 1st param and [1,2,3] in 2nd param, if value is NOT in array, it should return false', () => {
    const value = 'test'
    const array = [1, 2, 3]

    const res = arrayUtils.isValueInArray(value, array)

    expect(res).toBe(false)
  })
  it('when pass object in 1st param and array in 2nd param, if array has item that is DEEP EQUAL to your object, it should return true', () => {
    const value = { test: 1 }
    const array = [1, 2, { test: 1 }]

    const res = arrayUtils.isValueInArray(value, array)

    expect(res).toBe(true)
  })
  it('when pass array in 1st param and array in 2nd param, if array in 2nd param has item that is deep equal to your array in 1st param, it should return true', () => {
    const value = [1]
    const array = [1, 2, [1]]

    const res = arrayUtils.isValueInArray(value, array)

    expect(res).toBe(true)
  })
  it('should throw an error if 2nd param is not an array', () => {
    const value = 1
    const array = 2

    const fn = () => {
      arrayUtils.isValueInArray(value, array)
    }

    expect(fn).toThrow('2nd param must be an array')
  })
})
