// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import InputRules from '../../../../../public/js/validation/InputRules.js'
import typeCheck from '../../../../../public/js/utils/typeCheck.js'
import { Window } from 'happy-dom'
import objectUtils from '../../../../../utils/objectUtils.js'
import { IS_INPUT_RULES_INSTANCE } from '../../../../../public/js/validation/InputRules.js'

describe('InputRules', () => {
  let isInputElementSpy
  beforeEach(() => {
    document.body.innerHTML = ''
    isInputElementSpy = vi
      .spyOn(typeCheck, 'isInputElement')
      .mockReturnValue('true')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass an input element, it should call isInputElementSpy with that input', () => {
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')

    const inputRules = new InputRules(input)

    expect(isInputElementSpy).toBeCalledWith(input)
  })

  it('given isInputElementSpy returns true, when you pass valid input elemenet, inputRules.input is said input, inputRules.rules is an empty plain obj, and property that checks instanceof is true ', () => {
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')

    const inputRules = new InputRules(input)

    expect(inputRules.input).toEqual(input)
    expect(inputRules.rules).toEqual({})
    expect(inputRules[IS_INPUT_RULES_INSTANCE]).toBe(true)
  })
  it('given isInputElementSpy returns false, when you pass a non input value, it should throw an error', () => {
    isInputElementSpy.mockReturnValue(false)
    const input = 3

    const fn = () => {
      new InputRules(input)
    }

    expect(fn).toThrow(
      'You need to pass either an input element, select element or textarea element'
    )
  })

  describe('inputRules.addRule()', () => {
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

  describe('inputRules.getGroupInputs()', () => {
    it('when you pass a checkbox inside a form that has other checkboxes in that same group to the constructor, inputRules.getGroupInputs() should return an array of of those checkboxes', () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "genres" value = "fantasy">
          <input type = "checkbox" name = "genres" value = "history">
          <input type = "checkbox" name = "genres" value = "sci-fi">
        </form>
      `
      const firstCheckbox = document.querySelector(`[value="fantasy"]`)
      const form = document.querySelector('form')
      const allCheckboxes = Array.from(form.elements.genres)
      const inputRules = new InputRules(firstCheckbox)

      const result = inputRules.getGroupInputs()

      expect(result).toEqual(allCheckboxes)
    })

    it('when you pass a radio input inside a form that has other radios in that same group to the constructor, inputRules.getGroupInputs() should return an array of of those radio inputs', () => {
      document.body.innerHTML = `
        <form>
          <input type = "radio" name = "genre" value = "fantasy">
          <input type = "radio" name = "genre" value = "history">
          <input type = "radio" name = "genre" value = "sci-fi">
        </form>
      `
      const firstCheckbox = document.querySelector(`[value="fantasy"]`)
      const form = document.querySelector('form')
      const allRadios = Array.from(form.elements.genre)
      const inputRules = new InputRules(firstCheckbox)

      const result = inputRules.getGroupInputs()

      expect(result).toEqual(allRadios)
    })

    it('when you pass a single input of a form to the constructor, inputRules.getGroupInputs() should an empty array', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title">
        </form>
      `
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)

      const groupInputs = inputRules.getGroupInputs()

      expect(groupInputs.length).toBe(0)
    })

    it("when you pass an input that doesn't have name attrb value to constructor, inputRules.getFormInputs() should throw an error", () => {
      document.body.innerHTML = `
        <form>
          <input type = "text">
        </form>
      `
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)

      const fn = () => {
        inputRules.getGroupInputs()
      }

      expect(fn).toThrow(
        'The input in your inputRules instance needs to have name attribute value'
      )
    })
  })
})
