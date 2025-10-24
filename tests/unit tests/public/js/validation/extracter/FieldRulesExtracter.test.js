// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FieldRulesExtracter from '../../../../../../public/js/validation/extracters/FieldRulesExtracter.js'
import { Window } from 'happy-dom'
import typeCheck from '../../../../../../public/js/utils/typeCheck.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)
vi.stubGlobal('HTMLInputElement', window.HTMLInputElement)
vi.stubGlobal('HTMLSelectElement', window.HTMLSelectElement)
vi.stubGlobal('HTMLTextAreaElement', window.HTMLTextAreaElement)

describe('FieldRulesExtracter', () => {
  it('if you pass an array where atleast 1 item is not a function, it should throw an error', () => {
    const extractMethods = [1, () => {}]

    const fn = () => {
      new FieldRulesExtracter(extractMethods)
    }

    expect(fn).toThrow(
      'You need to pass an array of functions to first parameter'
    )
  })

  it('if you pass a non array value, it should throw an error', () => {
    const extractMethods = 3

    const fn = () => {
      new FieldRulesExtracter(extractMethods)
    }

    expect(fn).toThrow(
      'You need to pass an array of functions to first parameter'
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
    it('given an array of mocked extract functions, when you pass that array to constructor, .extractSingleType(singleTypeInput) should execute ALL of the mocked extract functions with correct inputErrorObj', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const required = vi.fn((inputErrorObj) => {})
      const maxLength = vi.fn((inputErrorObj) => {})
      const extractMethodsMock = [required, maxLength]
      const inputErrorObj = {
        input: input,
        rules: {},
      }

      const extracter = new FieldRulesExtracter(extractMethodsMock)
      const result = extracter.extractSingleType(input)

      expect(required).toBeCalledWith(inputErrorObj)
      expect(maxLength).toBeCalledWith(inputErrorObj)
    })

    it('given each mocked extract method in extractMethodsMock adds a different property to the inputErrorObj.rules, .extractSingleType(singleTypeInput) should return the updated inputErrorObj', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const required = vi.fn((inputErrorObj) => {
        inputErrorObj.rules.required = true
        return inputErrorObj
      })
      const maxLength = vi.fn((inputErrorObj) => {
        inputErrorObj.rules.maxLength = 3
        return inputErrorObj
      })
      const extractMethodsMock = [required, maxLength]

      const extracter = new FieldRulesExtracter(extractMethodsMock)
      const result = extracter.extractSingleType(input)

      const expectedResult = {
        input: input,
        rules: {
          required: true,
          maxLength: 3,
        },
      }
      expect(result).toEqual(expectedResult)
    })

    it('it should call typeCheck.isSingleInputType(input)', () => {
      const isSingleInputTypeMock = vi.spyOn(typeCheck, 'isSingleInputType')
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const required = vi.fn()
      const maxLength = vi.fn()
      const extractMethods = [required, maxLength]

      const extracter = new FieldRulesExtracter(extractMethods)
      const result = extracter.extractSingleType(input)

      expect(isSingleInputTypeMock).toBeCalledWith(input)
    })

    it('given typeCheck.isSingleInputType() returns false, .isSingleInputType() should throw an error', () => {
      const isSingleInputTypeMock = vi
        .spyOn(typeCheck, 'isSingleInputType')
        .mockReturnValue(false)
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const required = vi.fn()
      const maxLength = vi.fn()
      const extractMethods = [required, maxLength]

      const extracter = new FieldRulesExtracter(extractMethods)
      const fn = () => {
        extracter.extractSingleType(input)
      }
    })
  })
})
