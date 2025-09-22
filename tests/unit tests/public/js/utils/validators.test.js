import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import validators from '../../../../../public/js/utils/validators.js'
import randomString from 'randomstring'

describe('validators.isValidStoreName()', () => {
  it('when you pass valid bookstore name where string is not empty and is less and upto 100 characters, it should return true', () => {
    const name = randomString.generate(100)

    const result = validators.isValidStoreName(name)

    expect(result).toBe(true)
  })
  it('when you pass an empty string, it should return false', () => {
    const name = ''

    const result = validators.isValidStoreName(name)

    expect(result).toBe(false)
  })
  it('when you pass a string that is more than 100 characters, it should return false', () => {
    const name = randomString.generate(101)

    const result = validators.isValidStoreName(name)

    expect(result).toBe(false)
  })

  it('when you pass a non string, it should throw correct error', () => {
    const name = 3

    const fn = () => {
      validators.isValidStoreName(name)
    }

    expect(fn).toThrow('First parameter should be of string data type')
  })
})

describe('validators.isValidAddress()', () => {
  it('when you pass a valid address where it is not an empty string and is less and upto 255 characters, it should return true', () => {
    const address = randomString.generate(255)

    const result = validators.isValidAddress(address)

    expect(result).toBe(true)
  })
  it('when you pass string that is more than 255 characters, it should return false', () => {
    const address = randomString.generate(256)

    const result = validators.isValidAddress(address)

    expect(result).toBe(false)
  })
  it('when you pass string that is empty, it should return false', () => {
    const address = ''

    const result = validators.isValidAddress(address)

    expect(result).toBe(false)
  })

  it('when you pass a non string, it should throw correct error', () => {
    const address = 3

    const fn = () => {
      validators.isValidAddress(address)
    }

    expect(fn).toThrow('First parameter should be of string data type')
  })
})

describe('validators.isValidDescription()', () => {
  it('when you pass a string that is more than 500 characters, it should return false', () => {
    const description = randomString.generate(501)

    const result = validators.isValidDescription(description)

    expect(result).toBe(false)
  })
  it('when you pass an empty string, it should return false', () => {
    const description = ''

    const result = validators.isValidDescription(description)

    expect(result).toBe(false)
  })

  it('when you pass string that is not empty and is less and upto 500 characters, it should return true', () => {
    const description = randomString.generate(500)

    const result = validators.isValidDescription(description)

    expect(result).toBe(true)
  })

  it('when you pass a non string, it should throw correct error', () => {
    const description = 3

    const fn = () => {
      validators.isValidDescription(description)
    }

    expect(fn).toThrow('First parameter should be of string data type')
  })
})
