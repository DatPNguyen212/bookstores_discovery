import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import objectUtils from '../../../utils/objectUtils'

describe('objectUtils.isPlainObject()', () => {
  it('when an array is passed, it should return false', () => {
    const value = [1, 2, 3]

    const res = objectUtils.isPlainObject(value)

    expect(res).toBe(false)
  })
  it('when a plain object is passed, it should return true', () => {
    const value = {}

    const res = objectUtils.isPlainObject(value)

    expect(res).toBe(true)
  })
  it('when a string is passed, it should return false', () => {
    const value = '3'

    const res = objectUtils.isPlainObject(value)

    expect(res).toBe(false)
  })
  it('when a number is passed, it should return false', () => {
    const value = 3

    const res = objectUtils.isPlainObject(value)

    expect(res).toBe(false)
  })
  it('when a NaN value is passed, it should return false', () => {
    const value = NaN

    const res = objectUtils.isPlainObject(value)

    expect(res).toBe(false)
  })
  it('when undefined value is passed, it should return false', () => {
    const value = undefined

    const res = objectUtils.isPlainObject(value)

    expect(res).toBe(false)
  })
  it('when null is passed, it should return false', () => {
    const value = null

    const res = objectUtils.isPlainObject(value)

    expect(res).toBe(false)
  })
})
