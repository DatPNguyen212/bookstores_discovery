import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FieldRulesExtracter from '../../../../../../public/js/validation/extracters/FieldRulesExtracter.js'
import { Window } from 'happy-dom'
import typeCheck from '../../../../../../utils/typeCheck.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)
vi.stubGlobal('HTMLInputElement', window.HTMLInputElement)
vi.stubGlobal('HTMLSelectElement', window.HTMLSelectElement)
vi.stubGlobal('HTMLTextAreaElement', window.HTMLTextAreaElement)

describe('FieldRulesExtracter', () => {
  let fieldRulesExtracter
  beforeEach(() => {
    document.body.innerHTML = ''
    fieldRulesExtracter = new FieldRulesExtracter()
  })
  afterEach(() => {
    vi.restoreAllMocks()
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
    it('when you pass a single type input that has required attribute, it should return an obj that contains the input and required attribute true value', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')

      const result = fieldRulesExtracter.extractSingleType(input)

      const expectedResult = {
        input: input,
        rules: {
          required: true,
        },
      }

      expect(result).toEqual(expectedResult)
    })

    it('when you pass a text input that has maxLength attrb of 3, it should return an obj that contains the input and maxLength of 3', () => {
      document.body.innerHTML = `<input type = "text" maxLength = 3>`
      const input = document.querySelector('input')

      const result = fieldRulesExtracter.extractSingleType(input)

      const expectedResult = {
        input: input,
        rules: {
          maxLength: 3,
        },
      }
      expect(result).toEqual(expectedResult)
    })

    it('when you pass text input with invalid maxLength, it should return an obj that contains the input and maxLength does not exist', () => {
      document.body.innerHTML = `<input type = "text" maxLength = "test">`
      const input = document.querySelector('input')

      const result = fieldRulesExtracter.extractSingleType(input)

      const expectedResult = {
        input: input,
        rules: {},
      }
      expect(result).toEqual(expectedResult)
    })

    it('when you pass checkbox input, it should throw an error', () => {
      document.body.innerHTML = `<input type = "checkbox">`
      const input = document.querySelector('input')

      const fn = () => {
        fieldRulesExtracter.extractSingleType(input)
      }

      expect(fn).toThrow(
        'You need to pass either input, textarea or select element'
      )
    })
    it('when you pass radio input, it should throw an error', () => {
      document.body.innerHTML = `<input type = "radio">`
      const input = document.querySelector('input')

      const fn = () => {
        fieldRulesExtracter.extractSingleType(input)
      }

      expect(fn).toThrow(
        'You need to pass either input, textarea or select element'
      )
    })
    it('when you pass text area element, it should not throw an error', () => {
      document.body.innerHTML = `<textarea></textarea>`
      const input = document.querySelector('textarea')

      const fn = () => {
        fieldRulesExtracter.extractSingleType(input)
      }

      expect(fn).not.toThrow(
        'You need to pass either input, textarea or select element'
      )
    })
    it('when you pass select element, it should not throw an error', () => {
      document.body.innerHTML = `<select></select>`
      const input = document.querySelector('select')

      const fn = () => {
        fieldRulesExtracter.extractSingleType(input)
      }

      expect(fn).not.toThrow(
        'You need to pass either input, textarea or select element'
      )
    })

    it('when you pass an input element, it should call typeCheck.isSingleInputType() with that input', () => {
      document.body.innerHTML = `<input type = "text">`
      const input = document.querySelector('input')

      expect(isSingleInputTypeSpy).toBeCalledWith(input)
    })

    it('given typeCheck.isSingleInputType() return false, it should return false', () => {
      isSingleInputTypeSpy.mockReturnValue(false)

      const fn = () => {
        fieldRulesExtracter.extractSingleType()
      }

      expect(fn).toThrow(
        'You need to pass either input, textarea or select element'
      )
    })
  })
})
