// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import GroupValidator from '../../../../../public/js/validation/GroupValidator.js'
import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/InputErrorsFactoryBase.js'
import InputErrorsFactory from '../../../../../public/js/validation/InputErrorsFactory.js'
import { IS_INPUT_ERRORS_INSTANCE } from '../../../../../public/js/validation/InputErrors.js'
import InputRules, {
  IS_INPUT_RULES_INSTANCE,
} from '../../../../../public/js/validation/InputRules.js'
import { Window } from 'happy-dom'
import InputRulesFactory from '../../../../../public/js/validation/InputRulesFactory.js'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('GroupValidator', () => {
  describe('groupValidator.required()', () => {
    let groupValidator
    beforeEach(() => {
      document.body.innerHTML = ''

      groupValidator = new GroupValidator()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    // it('when you pass a non instanceof InputRules, it should throw an error', () => {
    //   const inputRules = 3

    //   const fn = () => {
    //     groupValidator.required(inputRules)
    //   }
    //   expect(fn).toThrow(
    //     'You need to pass an instance of InputRules as an argument'
    //   )
    // })

    it('when you pass a single input element, it should throw an error', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required>
        </form>
      `
      const input = document.querySelector('input')

      const fn = () => {
        groupValidator.required(input)
      }

      expect(fn).toThrow(
        'You need to pass group input element to first parameter'
      )
    })

    it('when you pass a checkbox element, it should NOT throw an error', () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "title" required>
        </form>
      `
      const input = document.querySelector('input')

      const fn = () => {
        groupValidator.required(input)
      }

      expect(fn).not.toThrow(
        'You need to pass group input element to first parameter'
      )
    })

    it('when you pass a radio element, it should NOT throw an error', () => {
      document.body.innerHTML = `
        <form>
          <input type = "radio" name = "title" required>
        </form>
      `
      const input = document.querySelector('input')

      const fn = () => {
        groupValidator.required(input)
      }

      expect(fn).not.toThrow(
        'You need to pass group input element to first parameter'
      )
    })

    it('when you do not pass any argument, it should throw an error', () => {
      const fn = () => {
        groupValidator.required()
      }

      expect(fn).toThrow(
        'You need to pass group input element to first parameter'
      )
    })

    // it('when you pass an instance of InputRules where inputRules.input is a checkbox, it should NOT throw an error', () => {
    //   document.body.innerHTML = `
    //     <form>
    //       <input type = "checkbox" name = "title" required>
    //     </form>
    //   `
    //   const checkbox = document.querySelector('input')
    //   const inputRules = new InputRules(checkbox)

    //   const fn = () => {
    //     groupValidator.required(inputRules)
    //   }

    //   expect(fn).not.toThrow(
    //     'inputRules.input needs to be a group element (either checkbox or radio)'
    //   )
    // })

    // it('when you pass an instance of InputRules where inputRules.input is a radio, it should NOT throw an error', () => {
    //   document.body.innerHTML = `
    //     <form>
    //       <input type = "radio" name = "title" required>
    //     </form>
    //   `
    //   const radio = document.querySelector('input')
    //   const inputRules = new InputRules(radio)

    //   const fn = () => {
    //     groupValidator.required(inputRules)
    //   }

    //   expect(fn).not.toThrow(
    //     'inputRules.input needs to be a group element (either checkbox or radio)'
    //   )
    // })

    it('given a form of a group of checkboxes of same name and they are ALL not checked, when you pass a  single checkbox element from them, it should return correct error string', () => {
      document.body.innerHTML = `
      <form>
        <input type = "checkbox" name = "genres" value = "fantasy" required>
        <input type = "checkbox" name = "genres" value = "sci-fi">
      </form>
      `
      const checkbox = document.querySelector(`[value="fantasy"]`)

      const result = groupValidator.required(checkbox)

      expect(result).toBe(`Atleast 1 input needs to be checked`)
    })

    it('given a form of a group of radios of same name and they are ALL not checked, when you pass a single radio element from them, it should return correct error string ', () => {
      document.body.innerHTML = `
      <form>
        <input type = "radio" name = "genre" value = "fantasy" required>
        <input type = "radio" name = "genre" value = "sci-fi">
      </form>
      `
      const radio = document.querySelector(`[value="fantasy"]`)

      const result = groupValidator.required(radio)

      expect(result).toBe(`Atleast 1 input needs to be checked`)
    })

    // it('given inputRules.getGroupInputs() return an array of radio inputs in a single group in a form where none of those radio inputs are checked, when you pass that inputRules instance, it should return an instanceof InputErrors that contains the first radio input and correct error ', () => {
    //   document.body.innerHTML = `
    //   <form>
    //     <input type = "radio" name = "genre" value = "fantasy" required>
    //     <input type = "radio" name = "genre" value = "sci-fi">
    //   </form>
    //   `
    //   const radio1 = document.querySelector(`[value="fantasy"]`)
    //   const radio2 = document.querySelector(`[value="sci-fi"]`)
    //   const groupInputs = [radio1, radio2]
    //   const inputRules = {
    //     input: radio1,
    //     [IS_INPUT_RULES_INSTANCE]: true,
    //     getGroupInputs: vi.fn(() => {
    //       return groupInputs
    //     }),
    //   }

    //   const inputErrors = groupValidator.required(inputRules)

    //   expect(inputErrors[IS_INPUT_ERRORS_INSTANCE]).toBe(true)
    //   expect(inputError.input).toEqual(radio1)
    //   expect(inputErrors.errors).toBe(`Atleast 1 input needs to be checked`)
    // })
  })
})
