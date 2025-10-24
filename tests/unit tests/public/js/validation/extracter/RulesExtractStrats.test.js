//@vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import RulesExtractStrats from '../../../../../../public/js/validation/extracters/RulesExtractStrats.js'
import { Window } from 'happy-dom'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('RulesExtractStrats', () => {
  let strats
  beforeEach(() => {
    document.body.innerHTML = ''
    strats = new RulesExtractStrats()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe('rulesExtractStrats.required()', () => {
    it('when you pass an obj that contains input element that has required attrb and rules obj property, it should return that same obj with rules.required === true', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const inputErrorObjMock = {
        input: input,
        rules: {},
      }

      const result = strats.required(inputErrorObjMock)

      expect(result.input).toEqual(input)
      expect(result.rules.required).toBe(true)
    })

    it('when you pass an obj that contains input element that has required attrb and rules obj property that already has a validation attrb property, it should return that same obj with rules.required === true with nothing else modified', () => {
      document.body.innerHTML = `<input type = "text" required>`
      const input = document.querySelector('input')
      const inputErrorObjMock = {
        input: input,
        rules: {
          maxLength: 3,
        },
      }

      const result = strats.required(inputErrorObjMock)

      const expectedResult = {
        input: input,
        rules: {
          maxLength: 3,
          required: true,
        },
      }
      expect(result).toEqual(expectedResult)
    })
  })

  describe('rulesExtractStracts.maxLength()', () => {
    it('when you pass an obj that contains input that has maxLength of 3 and rules obj property, it should return modified obj with inputErrorObj.rules.maxLength is 3', () => {
      document.body.innerHTML = `<input type = "text" maxLength = "3">`
      const input = document.querySelector('input')
      const inputErrorObjMock = {
        input: input,
        rules: {
          maxLength: 3,
        },
      }

      const result = strats.maxLength(inputErrorObjMock)

      expect(result.input).toEqual(input)
      expect(result.rules.maxLength).toBe(3)
    })

    it('when you pass an obj that contains an input that has required attrb and rules obj property is NOT empty, it should return that same obj with ONLY rules.maxLength added', () => {
      document.body.innerHTML = `<input type = "text" maxLength = "3">`
      const input = document.querySelector('input')
      const inputErrorObjMock = {
        input: input,
        rules: {
          required: true,
        },
      }

      const result = strats.maxLength(inputErrorObjMock)

      const expectedResult = {
        input: input,
        rules: {
          required: true,
          maxLength: 3,
        },
      }

      expect(result).toEqual(expectedResult)
    })

    it('when you pass an obj that contains input with negative maxLength value and rules obj property, it should return that same unmodified obj', () => {
      document.body.innerHTML = `<input type = "text" maxLength = "-3">`
      const input = document.querySelector('input')
      const inputErrorObjMock = {
        input: input,
        rules: {},
      }

      const result = strats.maxLength(inputErrorObjMock)

      const expectedResult = {
        input: input,
        rules: {},
      }

      expect(result).toEqual(expectedResult)
    })
  })
})
