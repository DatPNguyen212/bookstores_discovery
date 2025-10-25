// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import InputRules from '../../../../../public/js/validation/InputRules.js'
import typeCheck from '../../../../../public/js/utils/typeCheck.js'
import { Window } from 'happy-dom'
import objectUtils from '../../../../../utils/objectUtils.js'

describe('InputRules', () => {
  let isInputElement
  beforeEach(() => {
    document.body.innerHTML = ''
    isInputElement = vi
      .spyOn(typeCheck, 'isInputElement')
      .mockReturnValue('true')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass an input element, it should call typeCheck.isInputElement() with that input', () => {
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')

    const inputRules = new InputRules(input)

    expect(isInputElement).toBeCalledWith(input)
  })

  it('given typeCheck.isInputElement returns true, when you pass valid input elemenet, inputRules.input is said input, and inputRules.rules is a plain obj', () => {
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')

    const inputRules = new InputRules(input)

    expect(inputRules.input).toEqual(input)
    expect(objectUtils.isPlainObject(inputRules.rules)).toBe(true)
  })
  it('given typeCheck.isInputElement returns false, when you pass a non input value, it should throw an error', () => {
    isInputElement.mockReturnValue(false)
    const input = 3

    const fn = () => {
      new InputRules(input)
    }

    expect(fn).toThrow(
      'You need to pass either an input element, select element or textarea element'
    )
  })

  describe('InputRules.addRule()', () => {
    it('when you pass `required` and true, intError.rules should have required property with true value', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)
      const name = 'required'
      const value = true

      inputRules.addRule(name, value)

      expect(inputRules.rules.required).toBe(value)
    })
    it('if you pass a non string value in 1st param, it should throw an error', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)
      const name = 3
      const value = true

      const fn = () => {
        inputRules.addRule(name, value)
      }

      expect(fn).toThrow('First param needs to be of string data type')
    })

    it("If you don't pass a 2nd argument, it should throw an error", () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)
      const name = 'required'

      const fn = () => {
        inputRules.addRule(name)
      }

      expect(fn).toThrow(
        'You need to pass a value that is NOT undefined, null or object data type'
      )
    })

    it('if you pass null value to 2nd param, it should throw an error', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)
      const name = 'required'
      const value = null

      const fn = () => {
        inputRules.addRule(name, value)
      }

      expect(fn).toThrow(
        'You need to pass a value that is NOT undefined, null or object data type'
      )
    })

    it('if you pass a plain obj to 2nd param, it should throw an error', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)
      const name = 'required'
      const value = {}

      const fn = () => {
        inputRules.addRule(name, value)
      }

      expect(fn).toThrow(
        'You need to pass a value that is NOT undefined, null or object data type'
      )
    })

    it('if you pass an array to 2nd param, it should throw an error', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)
      const name = 'required'
      const value = [1, 2]

      const fn = () => {
        inputRules.addRule(name, value)
      }

      expect(fn).toThrow(
        'You need to pass a value that is NOT undefined, null or object data type'
      )
    })
  })
})
