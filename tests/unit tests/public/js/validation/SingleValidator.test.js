// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import SingleValidator from '../../../../../public/js/validation/SingleValidator.js'
import { Window } from 'happy-dom'
import objectUtils from '../../../../../utils/objectUtils.js'
import FormInputExtracter from '../../../../../public/js/validation/FormInputExtracter.js'
import InputErrorFactory from '../../../../../public/js/validation/InputErrorFactory.js'
import { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/InputErrorFactoryBase.js'
import { IS_SINGLE_VALIDATOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SingleValidatorBase.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)
vi.stubGlobal('HTMLInputElement', window.HTMLInputElement)
vi.stubGlobal('HTMLTextAreaElement', window.HTMLTextAreaElement)
vi.stubGlobal('HTMLSelectElement', window.HTMLSelectElement)

describe('SingleValidator()', () => {
  let singleValidator
  let inputErrorFactoryMock

  beforeEach(() => {
    document.body.innerHTML = ''
    inputErrorFactoryMock = {
      [IS_INPUT_ERROR_FACTORY_BASE_INSTANCE]: true,
      create(input) {
        return {
          input: input,
          error: null,
        }
      },
    }
    singleValidator = new SingleValidator(inputErrorFactoryMock)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass a non instance of InputErrorFactory to constructor, it should throw an error', () => {
    const inputErrorFactory = 3

    const fn = () => {
      new SingleValidator(inputErrorFactory)
    }

    expect(fn).toThrow('You need to pass an instance of InputErrorFactoryBase')
  })

  it("when you don't pass any arugment to constructor, it should throw an error", () => {
    const fn = () => {
      new SingleValidator()
    }

    expect(fn).toThrow('You need to pass an instance of InputErrorFactoryBase')
  })
  it('when you pass an instance of InputErrorFactory to constructor, singleValidator.inputErrorFactory is equal to that instance', () => {
    const singleValidator = new SingleValidator(inputErrorFactoryMock)

    expect(singleValidator.inputErrorFactory).toEqual(inputErrorFactoryMock)
  })
  it('when you pass valid inputErrorFactory to constructor, the instance should have property that checks instance of SingleValidatorBase', () => {
    const singleValidator = new SingleValidator(inputErrorFactoryMock)

    expect(singleValidator[IS_SINGLE_VALIDATOR_BASE_INSTANCE]).toBe(true)
  })

  describe('singleValidator.required()', () => {
    it('given input has no value, when you pass it to singleValidator.required(), it should return an obj which contains the input and correct error', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')

      const result = singleValidator.required(input)

      expect(objectUtils.isPlainObject(result)).toBe(true)
      expect(result.input).toEqual(input)
      expect(result.error).toBe('This field is required')
    })

    it('given input has value, when you pass it to singleValidator.required(), it should return an obj which contains the input and error is null', () => {
      document.body.innerHTML = `<input type = "text" required value = "testValue">`
      const input = document.querySelector('input')

      const result = singleValidator.required(input)

      expect(objectUtils.isPlainObject(result)).toBe(true)
      expect(result.input).toEqual(input)
      expect(result.error).toBe(null)
    })

    it('if you pass a non input obj, it should throw an error', () => {
      const input = 3

      const fn = () => {
        singleValidator.required(input)
      }

      expect(fn).toThrow(
        'You need to pass single input type element to the function, NOT group input type element'
      )
    })
    it('if you pass textarea input, it should NOT throw an error', () => {
      document.body.innerHTML = ` <textarea value = "test"></textarea>`
      const input = document.querySelector('textarea')

      const fn = () => {
        singleValidator.required(input)
      }

      expect(fn).not.toThrow(
        'You need to pass single input element to the function'
      )
    })
    it('if you pass select input, it should NOT throw an error', () => {
      document.body.innerHTML = `<select name="" id="">
       <option value="test1">test1</option>
       <option value="test2">test2</option>
     </select>`

      const input = document.querySelector('select')

      const fn = () => {
        singleValidator.required(input)
      }

      expect(fn).not.toThrow(
        'You need to pass single input type element to the function, NOT group input type element'
      )
    })
  })

  describe('singleValidator.maxLength()', () => {
    it('given input.value of 4 characters, you pass input and 3 to .maxLength(), it should return an obj which contain the input and correct error', () => {
      document.body.innerHTML = `<input type = "text" value = "1234" maxLength = 3>`
      const input = document.querySelector('input')
      const maxLength = 3

      const result = singleValidator.maxLength(input, maxLength)

      expect(objectUtils.isPlainObject(result)).toBe(true)
      expect(result.input).toEqual(input)
      expect(result.error).toBe(
        `This field needs to be less or equal to ${maxLength}`
      )
    })
    it('given input.value of 3 characters, you pass input and 3 to .maxLength(), it should return an obj which contain the input and error is null', () => {
      document.body.innerHTML = `<input type = "text" value = "123" maxLength = 3>`
      const input = document.querySelector('input')
      const maxLength = 3

      const result = singleValidator.maxLength(input, maxLength)

      expect(objectUtils.isPlainObject(result)).toBe(true)
      expect(result.input).toEqual(input)
      expect(result.error).toBe(null)
    })
    it('given input.value of 2 characters, you pass input and 3 to .maxLength(), it should return an obj which contain the input and error is null', () => {
      document.body.innerHTML = `<input type = "text" value = "12" maxLength = 3>`
      const input = document.querySelector('input')
      const maxLength = 3

      const result = singleValidator.maxLength(input, maxLength)

      expect(objectUtils.isPlainObject(result)).toBe(true)
      expect(result.input).toEqual(input)
      expect(result.error).toBe(null)
    })

    it('if you pass a non input obj in first param, it should throw an error', () => {
      document.body.innerHTML = `<input type = "text" value = "12" maxLength = 3>`
      const input = 3
      const maxLength = 3

      const fn = () => {
        singleValidator.maxLength(input, maxLength)
      }

      expect(fn).toThrow(
        'First parameter needs to be a single input type element, NOT group input type element'
      )
    })

    it('if you pass a non number data type to 2nd param, it should throw an error', () => {
      document.body.innerHTML = `<input type = "text" value = "12" maxLength = 3>`
      const input = document.querySelector('input')
      const maxLength = 'test'

      const fn = () => {
        singleValidator.maxLength(input, maxLength)
      }

      expect(fn).toThrow('Second parameter needs to be of number data type')
    })

    it('if you pass text area element to 1st param, it should NOT throw an error', () => {
      document.body.innerHTML = '<textarea value = "123"></textarea>'
      const input = document.querySelector('textarea')
      const maxLength = 4

      const fn = () => {
        singleValidator.maxLength(input, maxLength)
      }

      expect(fn).not.toThrow(
        'First parameter needs to be a single input type element, NOT group input type element'
      )
    })
  })

  //   describe('singleValidator.groupInputRequired()', () => {
  //     it('when you pass an array of non checked checkboxes, it should return an obj which contains the array of inputs and the correct error', () => {
  //       document.body.innerHTML = `<form action="">
  //   <fieldset>
  //     <legend>Genres</legend>
  //     <input type="checkbox" value = "fantasy" name = "bookstore[genres]" id = "fantasy">
  //     <label for="fantasy">fantasy</label>
  //     <input type="checkbox" value = "science" name = "bookstore[genres]" id = "science">
  //     <label for="science">science</label>
  //   </fieldset>
  // </form>`
  //       const form = document.querySelector('form')
  //       const formInputExtracter = new FormInputExtracter()
  //       const inputs = formInputExtracter.getFormInputs(form).flat(1)

  //       const result = singleValidator.groupInputRequired(inputs)

  //       expect(objectUtils.isPlainObject(result)).toBe(true)
  //       expect(result.inputs).toEqual(inputs)
  //       expect(result.error).toBe('This field is required')
  //     })

  //     it('when you pass an array of checkboxes where one is checked, it should return an object which contains inputs array and error is null', () => {
  //       document.body.innerHTML = `<form action="">
  //   <fieldset>
  //     <legend>Genres</legend>
  //     <input type="checkbox" value = "fantasy" name = "bookstore[genres]" id = "fantasy">
  //     <label for="fantasy">fantasy</label>
  //     <input type="checkbox" value = "science" name = "bookstore[genres]" id = "science" checked>
  //     <label for="science">science</label>
  //   </fieldset>
  // </form>`
  //       const form = document.querySelector('form')
  //       const formInputExtracter = new FormInputExtracter()
  //       const inputs = formInputExtracter.getFormInputs(form)

  //       const result = singleValidator.groupInputRequired(inputs[0])

  //       expect(objectUtils.isPlainObject(result)).toBe(true)
  //       expect(result.inputs).toEqual(inputs[0])
  //       expect(result.error).toBe(null)
  //     })

  //     it('when you pass an array of inputs where atleast one item is single input type, it should throw an error', () => {
  //       document.body.innerHTML = `<form action="">
  //       <fieldset>
  //         <legend>Genres</legend>
  //         <input type="checkbox" value = "fantasy" name = "bookstore[genres]" id = "fantasy">
  //         <label for="fantasy">fantasy</label>
  //         <input type="checkbox" value = "science" name = "bookstore[genres]" id = "science" checked>
  //         <label for="science">science</label>
  //       </fieldset>

  //       <fieldset>
  //         <input type = "text" name = "bookstore[title]">
  //       </fieldset>
  //     </form>`
  //       const form = document.querySelector('form')
  //       const formInputExtracter = new FormInputExtracter()
  //       const inputs = formInputExtracter.getFormInputs(form)

  //       console.log(inputs[2])

  //       const fn = () => {
  //         singleValidator.groupInputRequired(inputs)
  //       }

  //       expect(fn).toThrow(
  //         'First parameter should be an array of group type inputs'
  //       )
  //     })
  //   })
})
// FormValidator depends InputExtracter, ValidateAttrbExtracter, FormErrorRenderer
// FormValidator.validate()
// loop trhough inputs, validateAttributeExtracter.extract(input)
// Then you get obj with input and validation attributes and their values
// then you fieldValidator.validate(obj); to get obj that contian input and error
// Push each of these obj into arrayOfInputsAndErrors
// FormErrorRenderer depends on ElementRenderer
// formErrorRenderer.hideAllErrors("querySelectorOfError")
// formErrorRenderer.renderErrors(arrayOfInputsAndErrors, configureClassAndIfObj)
