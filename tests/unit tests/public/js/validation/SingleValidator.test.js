// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import SingleValidator from '../../../../../public/js/validation/SingleValidator.js'
import { Window } from 'happy-dom'
import objectUtils from '../../../../../utils/objectUtils.js'
import FormInputExtracter from '../../../../../public/js/validation/FormInputExtracter.js'
import InputErrorsFactory from '../../../../../public/js/validation/InputErrorsFactory.js'
import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/InputErrorsFactoryBase.js'
import { IS_SINGLE_VALIDATOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SingleValidatorBase.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)
vi.stubGlobal('HTMLInputElement', window.HTMLInputElement)
vi.stubGlobal('HTMLTextAreaElement', window.HTMLTextAreaElement)
vi.stubGlobal('HTMLSelectElement', window.HTMLSelectElement)

describe('SingleValidator()', () => {
  let singleValidator

  beforeEach(() => {
    document.body.innerHTML = ''

    singleValidator = new SingleValidator()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('singleValidator.required()', () => {
    it('when you pass a non string value to 1st param, it should throw an error', () => {
      const inputValue = 3

      const fn = () => {
        singleValidator.required(inputValue)
      }

      expect(fn).toThrow('You need to pass string data type to first parameter')
    })

    it('when you pass an empty string, it should return correct error string', () => {
      const inputValue = ''

      const result = singleValidator.required(inputValue)

      expect(result).toBe('This field is required')
    })

    it('when you pass a string that is not empty, it should return null', () => {
      const inputValue = 'test'

      const result = singleValidator.required(inputValue)

      expect(result).toBeNull()
    })
  })

  describe('singleValidator.maxLength()', () => {
    it('if you pass a non string value to 1st param, it should throw an error', () => {
      const inputValue = 3
      const maxLength = 4

      const fn = () => {
        singleValidator.maxLength(inputValue, maxLength)
      }

      expect(fn).toThrow('You need to pass string data type to first parameter')
    })

    it('if you pass a non number value to 2nd param, it should throw an error', () => {
      const inputValue = 'test'
      const maxLength = 'test'

      const fn = () => {
        singleValidator.maxLength(inputValue, maxLength)
      }

      expect(fn).toThrow(
        'You need to pass number that is larger than 0 in 2nd paramer'
      )
    })

    it('when you pass a negative value to 2nd param, it should throw an error', () => {
      const inputValue = 'test'
      const maxLength = -3

      const fn = () => {
        singleValidator.maxLength(inputValue, maxLength)
      }

      expect(fn).toThrow(
        'You need to pass number that is larger than 0 in 2nd paramer'
      )
    })

    it('when you pass 0 to 2nd parameter, it should throw an error', () => {
      const inputValue = 'test'
      const maxLength = 0

      const fn = () => {
        singleValidator.maxLength(inputValue, maxLength)
      }

      expect(fn).toThrow(
        'You need to pass number that is larger than 0 in 2nd paramer'
      )
    })

    it('if you pass a string in 1st param whose length is < maxLength in 2nd param, it should return null', () => {
      const inputValue = 'test'
      const maxLength = 5

      const result = singleValidator.maxLength(inputValue, maxLength)

      expect(result).toBeNull()
    })
    it('if you pass a string in 1st param whose length is === maxLength in 2nd param, it should return null', () => {
      const inputValue = 'test'
      const maxLength = 4

      const result = singleValidator.maxLength(inputValue, maxLength)

      expect(result).toBeNull()
    })

    it('if you pass a string in 1st param whose length is > maxLength in 2nd param, it should return correct error string', () => {
      const inputValue = 'test'
      const maxLength = 2

      const result = singleValidator.maxLength(inputValue, maxLength)

      expect(result).toBe(
        `This field must have atleast ${maxLength} characters`
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
  //       expect(result.errors).toBe('This field is required')
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
  //       expect(result.errors).toBe(null)
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
