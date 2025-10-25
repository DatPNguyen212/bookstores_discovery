// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FieldRulesExtracter from '../../../../../../public/js/validation/extracters/FieldRulesExtracter.js'
import { Window } from 'happy-dom'
import typeCheck from '../../../../../../public/js/utils/typeCheck.js'
import { IS_INPUT_RULES_BASE_INSTANCE } from '../../../../../../public/js/abstracts/validation/InputRulesBase.js'
import InputRules from '../../../../../../public/js/validation/InputRules.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)
vi.stubGlobal('HTMLInputElement', window.HTMLInputElement)
vi.stubGlobal('HTMLSelectElement', window.HTMLSelectElement)
vi.stubGlobal('HTMLTextAreaElement', window.HTMLTextAreaElement)

describe('FieldRulesExtracter', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('if you pass an array where atleast 1 item is not a function, it should throw an error', () => {
    const extractMethods = [1, () => {}]
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')
    const inputRules = new InputRules(input)

    const fn = () => {
      new FieldRulesExtracter(extractMethods, inputRules)
    }

    expect(fn).toThrow(
      'You need to pass an array of functions to first parameter'
    )
  })

  it('if you pass a non array value, it should throw an error', () => {
    const extractMethods = 3
    document.body.innerHTML = `<input type = "text">`
    const input = document.querySelector('input')
    const inputRules = new InputRules(input)

    const fn = () => {
      new FieldRulesExtracter(extractMethods, inputRules)
    }

    expect(fn).toThrow(
      'You need to pass an array of functions to first parameter'
    )
  })

  it('if you pass a value that is not instance of InputRulesBase, it should throw an error', () => {
    const extractMethods = [() => {}, () => {}]
    const inputRules = 3

    const fn = () => {
      new FieldRulesExtracter(extractMethods, inputRules)
    }

    expect(fn).toThrow(
      'You need to pass an instance of InputRulesBase to 2nd parameter'
    )
  })

  describe('fieldRulesExtracter.extractSingleType()', () => {
    let isSingleInputTypeSpy
    beforeEach(() => {
      isSingleInputTypeSpy = vi
        .spyOn(typeCheck, 'isSingleInputType')
        .mockReturnValue(true)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('given each mocked extract method in extractMethodsMock adds a different property to the inputRules.rules, .extractSingleType(singleTypeInput) should return the updated inputRules', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const required = vi.fn((inputRules) => {
        inputRules.rules.required = true
        return inputRules
      })
      const maxLength = vi.fn((inputRules) => {
        inputRules.rules.maxLength = 3
        return inputRules
      })
      const extractMethodsMock = [required, maxLength]
      const inputRulesMock = new InputRules(input)

      const extracter = new FieldRulesExtracter(
        extractMethodsMock,
        inputRulesMock
      )
      const result = extracter.extractSingleType()

      const expectedResult = {
        input: input,
        rules: {
          required: true,
          maxLength: 3,
        },
      }
      expect(result).toEqual(expectedResult)
    })
  })
})
