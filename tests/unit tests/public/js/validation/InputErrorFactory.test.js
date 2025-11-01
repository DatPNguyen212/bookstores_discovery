// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import InputErrorFactory from '../../../../../public/js/validation/InputErrorFactory.js'
import { IS_INPUT_ERROR_INSTANCE } from '../../../../../public/js/validation/InputError.js'
import InputError from '../../../../../public/js/validation/InputError.js'
import typeCheck from '../../../../../public/js/utils/typeCheck.js'
import { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/InputErrorFactoryBase.js'
import { Window } from 'happy-dom'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

vi.mock('../../../../../public/js/validation/InputError.js', () => {
  const IS_INPUT_ERROR_INSTANCE = Symbol('InputError/is-instance')

  const InputErrorMock = vi.fn(function (input) {
    this.input = input
    this.error = null
    this[IS_INPUT_ERROR_INSTANCE] = true
  })
  return {
    default: InputErrorMock,
    IS_INPUT_ERROR_INSTANCE,
  }
})

describe('InputErrorFactory', () => {
  let inputErrorFactory
  let isInputElementSpy
  beforeEach(() => {
    document.body.innerHTML = ''
    inputErrorFactory = new InputErrorFactory()
    isInputElementSpy = vi
      .spyOn(typeCheck, 'isInputElement')
      .mockReturnValue(true)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('when you instantiate the constructor, the instance should have property to check instance of InputErrorFactoryBase', () => {
    const inputErrorFactory = new InputErrorFactory()

    console.log(inputErrorFactory[IS_INPUT_ERROR_FACTORY_BASE_INSTANCE])
    expect(inputErrorFactory[IS_INPUT_ERROR_FACTORY_BASE_INSTANCE]).toBe(true)
  })

  describe('inputErrorFactory.create()', () => {
    it('when you pass input, it should return instance of InputError', () => {
      document.body.innerHTML = `<input type = "text">`
      const input = document.querySelector('input')

      const inputError = inputErrorFactory.create(input)

      expect(inputError[IS_INPUT_ERROR_INSTANCE]).toBe(true)
    })
    it('when you pass input, it should call new InputError() with said input', () => {
      document.body.innerHTML = `<input type = "text">`
      const input = document.querySelector('input')

      const inputError = inputErrorFactory.create(input)

      expect(InputError).toBeCalledWith(input)
    })

    it('when you pass input, it should call typeCheck.isInputElement() with that input', () => {
      document.body.innerHTML = `<input type = "text">`
      const input = document.querySelector('input')

      const inputError = inputErrorFactory.create(input)

      expect(isInputElementSpy).toBeCalledWith(input)
    })

    it('given typeCheck.isInputElement() returns false, when you pass a non input element, it should throw an error', () => {
      isInputElementSpy.mockReturnValue(false)
      const input = 3

      const fn = () => {
        inputErrorFactory.create(input)
      }

      expect(fn).toThrow('You need to pass an input element in first parameter')
    })
  })
})
