import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import InputError from '../../../../../public/js/validation/InputError.js'
import typeCheck from '../../../../../public/js/utils/typeCheck.js'
import { IS_INPUT_ERROR_INSTANCE } from '../../../../../public/js/validation/InputError.js'
import { Window } from 'happy-dom'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('InputError', () => {
  let isInputElementMock
  beforeEach(() => {
    document.body.innerHTML = ''
    isInputElementMock = vi
      .spyOn(typeCheck, 'isInputElement')
      .mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass input to constructor when instantiating, inputErrror should contain input property with value of that input, an error property with value of null, and a symbol property to check instanceof', () => {
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')

    const inputError = new InputError(input)

    expect(inputError.input).toEqual(input)
    expect(inputError.error).toBe(null)
    expect(inputError[IS_INPUT_ERROR_INSTANCE]).toBe(true)
  })
  it('when you pass input element to constructor, it should call typeCheck.isInputElement() with that input', () => {
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')

    const inputError = new InputError(input)

    expect(isInputElementMock).toBeCalledWith(input)
  })

  it('given isInputElementMock returns false, when you pass a non input element to constructor, it should throw an error', () => {
    isInputElementMock.mockReturnValue(false)
    const input = 3

    const fn = () => {
      new InputError(input)
    }

    expect(fn).toThrow('You need to pass an input element to first parameter')
  })

  describe('inputError.setError()', () => {
    it('when you pass a string, inputError.error value should be that string', () => {
      document.body.innerHTML = `<input type = "text">`
      const input = document.querySelector('input')
      const inputError = new InputError(input)
      const error = 'test'

      inputError.setError(error)

      expect(inputError.error).toBe(error)
    })

    it("if you don't pass a non stirng data type, it should throw an error", () => {
      document.body.innerHTML = `<input type = "text">`
      const input = document.querySelector('input')
      const inputError = new InputError(input)
      const error = 3

      const fn = () => {
        inputError.setError(error)
      }

      expect(fn).toThrow('You need to pass a string to first parameter')
    })
  })
})
