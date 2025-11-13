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

    it('if you pass a number to 1st param, it should throw an error', () => {
      const areInputsChecked = 3

      const fn = () => {
        groupValidator.required(areInputsChecked)
      }

      expect(fn).toThrow('You need to pass an array of boolean values')
    })

    it('if you pass an array where NOT all of the items are boolean values, it should throw an error', () => {
      const areInputsChecked = [true, false, 1]

      const fn = () => {
        groupValidator.required(areInputsChecked)
      }

      expect(fn).toThrow('You need to pass an array of boolean values')
    })

    it("when you pass an array where there's atleast one item whose value is false, it should return correct error string", () => {
      const areInputsChecked = [false, true, true]

      const result = groupValidator.required(areInputsChecked)

      expect(result).toBe('Atleast one item must be checked')
    })

    it("when you pass an array where all items' values are true, it should return null", () => {
      const areInputsChecked = [true, true, true]

      const result = groupValidator.required(areInputsChecked)

      expect(result).toBeNull()
    })
  })
})
