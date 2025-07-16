import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import objectUtils from './objectUtils'

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
  it('when a FALSY value is passed, it should return false', () => {
    const value = NaN

    const res = objectUtils.isPlainObject(value)

    expect(res).toBe(false)
  })
})
