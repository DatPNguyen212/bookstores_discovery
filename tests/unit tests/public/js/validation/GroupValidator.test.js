// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import GroupValidator from '../../../../../public/js/validation/GroupValidator.js'
import { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/InputErrorFactoryBase.js'
import InputErrorFactory from '../../../../../public/js/validation/InputErrorFactory.js'
import { IS_INPUT_ERROR_INSTANCE } from '../../../../../public/js/validation/InputError.js'
import InputRules, {
  IS_INPUT_RULES_INSTANCE,
} from '../../../../../public/js/validation/InputRules.js'
import { Window } from 'happy-dom'
import InputRulesFactory from '../../../../../public/js/validation/InputRulesFactory.js'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('GroupValidator', () => {
  it('when you pass a non instance of InputErrorFactoryBase to constructor, it should throw an error', () => {
    const inputErrorFactory = 3

    const fn = () => {
      new GroupValidator(undefined)
    }

    expect(fn).toThrow(
      'You need to pass an instanceof InputErrorFactoryBase to first parameter'
    )
  })
  it("when you don't pass any argument to constructor, it should throw an error", () => {
    const fn = () => {
      new GroupValidator()
    }

    expect(fn).toThrow(
      'You need to pass an instanceof InputErrorFactoryBase to first parameter'
    )
  })

  it('when you pass valid inputErrorFactory, groupValidator.inputErrorFactory should be that argument', () => {
    const inputErrorFactory = new InputErrorFactory()

    const groupValidator = new GroupValidator(inputErrorFactory)

    expect(groupValidator.inputErrorFactory).toEqual(inputErrorFactory)
  })

  describe('groupValidator.required()', () => {
    let groupValidator
    let inputErrorFactory
    beforeEach(() => {
      document.body.innerHTML = ''
      inputErrorFactory = new InputErrorFactory()
      groupValidator = new GroupValidator(inputErrorFactory)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('when you pass a non instanceof InputRules, it should throw an error', () => {
      const inputRules = 3

      const fn = () => {
        groupValidator.required(inputRules)
      }
      expect(fn).toThrow(
        'You need to pass an instance of InputRules as an argument'
      )
    })

    it('when you pass an instance of InputRules where inputRules.input is NOT group type input, it should throw an error', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required>
        </form>
      `
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)

      const fn = () => {
        groupValidator.required(inputRules)
      }

      expect(fn).toThrow(
        'inputRules.input needs to be a group element (either checkbox or radio)'
      )
    })

    it('when you pass an instance of InputRules where inputRules.input is a checkbox, it should NOT throw an error', () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "title" required>
        </form>
      `
      const checkbox = document.querySelector('input')
      const inputRules = new InputRules(checkbox)

      const fn = () => {
        groupValidator.required(inputRules)
      }

      expect(fn).not.toThrow(
        'inputRules.input needs to be a group element (either checkbox or radio)'
      )
    })

    it('when you pass an instance of InputRules where inputRules.input is a radio, it should NOT throw an error', () => {
      document.body.innerHTML = `
        <form>
          <input type = "radio" name = "title" required>
        </form>
      `
      const radio = document.querySelector('input')
      const inputRules = new InputRules(radio)

      const fn = () => {
        groupValidator.required(inputRules)
      }

      expect(fn).not.toThrow(
        'inputRules.input needs to be a group element (either checkbox or radio)'
      )
    })

    it('given inputRules.getGroupInputs() return an array of checkbox elements in a single group in a form where none of those checkboxes are checked, when you pass that inputRules instance, it should return an instanceof InputError that contains the first input and correct error ', () => {
      document.body.innerHTML = `
      <form>
        <input type = "checkbox" name = "genres" value = "fantasy" required>
        <input type = "checkbox" name = "genres" value = "sci-fi">
      </form>
      `
      const checkbox1 = document.querySelector(`[value="fantasy"]`)
      const checkbox2 = document.querySelector(`[value="sci-fi"]`)
      const groupInputs = [checkbox1, checkbox2]
      const inputRules = {
        input: checkbox1,
        [IS_INPUT_RULES_INSTANCE]: true,
        getGroupInputs: vi.fn(() => {
          return groupInputs
        }),
      }

      const inputError = groupValidator.required(inputRules)

      expect(inputError[IS_INPUT_ERROR_INSTANCE]).toBe(true)
      expect(inputError.input).toEqual(checkbox1)
      expect(inputError.error).toBe(`Atleast 1 input needs to be checked`)
    })

    it('given inputRules.getGroupInputs() return an array of radio inputs in a single group in a form where none of those radio inputs are checked, when you pass that inputRules instance, it should return an instanceof InputError that contains the first radio input and correct error ', () => {
      document.body.innerHTML = `
      <form>
        <input type = "radio" name = "genre" value = "fantasy" required>
        <input type = "radio" name = "genre" value = "sci-fi">
      </form>
      `
      const radio1 = document.querySelector(`[value="fantasy"]`)
      const radio2 = document.querySelector(`[value="sci-fi"]`)
      const groupInputs = [radio1, radio2]
      const inputRules = {
        input: radio1,
        [IS_INPUT_RULES_INSTANCE]: true,
        getGroupInputs: vi.fn(() => {
          return groupInputs
        }),
      }

      const inputError = groupValidator.required(inputRules)

      expect(inputError[IS_INPUT_ERROR_INSTANCE]).toBe(true)
      expect(inputError.input).toEqual(radio1)
      expect(inputError.error).toBe(`Atleast 1 input needs to be checked`)
    })
  })
})
