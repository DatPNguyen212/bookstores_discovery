// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ValidationProcessor from '../../../../../public/js/validation/ValidationProcessor.js'
import { Window } from 'happy-dom'
import SingleValidator from '../../../../../public/js/validation/SingleValidator'
import InputErrorsFactory from '../../../../../public/js/validation/InputErrorsFactory'
import GroupValidator from '../../../../../public/js/validation/GroupValidator'
import InputRules from '../../../../../public/js/validation/InputRules'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('ValidationProcessor', () => {
  let validationProcessor
  let singleValidator
  let groupValidator
  let inputErrorsFactory

  beforeEach(() => {
    document.body.innerHTML = ''
    inputErrorsFactory = new InputErrorsFactory()
    singleValidator = new SingleValidator()
    groupValidator = new GroupValidator()
    validationProcessor = new ValidationProcessor(
      singleValidator,
      groupValidator,
      inputErrorsFactory
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('validationProcessor.validate()', () => {
    it('when you pass inputRulesArray which only contains InputRules instances for single input elements with required and minLength rules but failed to meet them, it should return correct inputErrorsArray', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required minLength = "3">
          <textarea name = "description" required minLength = "3"></textarea>
        </form>
      `
      const input = document.querySelector('input')
      const textarea = document.querySelector('textarea')
      const inputRules1 = new InputRules(input)
      inputRules1.rules.required = true
      inputRules1.rules.minLength = 3
      const inputRules2 = new InputRules(textarea)
      inputRules2.rules.required = true
      inputRules2.rules.minLength = 3
      const inputRulesArray = [inputRules1, inputRules2]

      const inputErrorsArray = validationProcessor.validate(inputRulesArray)

      expect(inputErrorsArray[0].input).toEqual(input)
      expect(inputErrorsArray[0].errors[0]).toBeTruthy()
      expect(inputErrorsArray[0].errors[1]).toBeTruthy()
      expect(inputErrorsArray[1].input).toEqual(textarea)
      expect(inputErrorsArray[1].errors[0]).toBeTruthy()
      expect(inputErrorsArray[1].errors[1]).toBeTruthy()
    })

    it('when you pass inputRulesArray which only contains InputRules instances for single input elements with required and minLength rules and successfully meet it, it should return correct inputErrorsArray', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" value = "test" required minLength = "3">
          <textarea name = "description" required minLength = "3">test</textarea>
        </form>
      `
      const input = document.querySelector('input')
      const textarea = document.querySelector('textarea')
      const inputRules1 = new InputRules(input)
      inputRules1.rules.required = true
      inputRules1.rules.minLength = 3
      const inputRules2 = new InputRules(textarea)
      inputRules2.rules.required = true
      inputRules2.rules.minLength = 3
      const inputRulesArray = [inputRules1, inputRules2]

      const inputErrorsArray = validationProcessor.validate(inputRulesArray)

      expect(inputErrorsArray[0].input).toEqual(input)
      expect(inputErrorsArray[0].errors[0]).toBeNull()
      expect(inputErrorsArray[0].errors[1]).toBeNull()
      expect(inputErrorsArray[1].input).toEqual(textarea)
      expect(inputErrorsArray[1].errors[0]).toBeNull()
      expect(inputErrorsArray[1].errors[1]).toBeNull()
    })

    it('when you pass inputRulesArray which contains InputRules instances for group inputs with required rule but they fail to meet it, it should return correct inputErrorsArray', () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "genres" value = "fantasy" required>
          <input type = "checkbox" name = "genres" value = "sci-fi">

          <input type = "radio" name = "isOnline" value = "true" required>
          <input type = "radio" name = "isOnline" value = "false">
        </form>
      `
      const firstCheckbox = document.querySelector(`[value="fantasy"]`)
      const firstRadio = document.querySelector(`[value="true"]`)

      const inputRules1 = new InputRules(firstCheckbox)
      inputRules1.rules.required = true
      const inputRules2 = new InputRules(firstRadio)
      inputRules2.rules.required = true

      const inputRulesArray = [inputRules1, inputRules2]

      const inputErrorsArray = validationProcessor.validate(inputRulesArray)

      expect(inputErrorsArray[0].input).toEqual(firstCheckbox)
      expect(inputErrorsArray[0].errors[0]).toBeTruthy()
      expect(inputErrorsArray[1].input).toEqual(firstRadio)
      expect(inputErrorsArray[1].errors[0]).toBeTruthy()
    })

    it('when you pass inputRulesArray which contains InputRules instances for group inputs with required rule and successfully meet it, it should return correct inputErrorsArray', () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "genres" value = "fantasy" required checked>
          <input type = "checkbox" name = "genres" value = "sci-fi">

          <input type = "radio" name = "isOnline" value = "true" required checked>
          <input type = "radio" name = "isOnline" value = "false">
        </form>
      `
      const firstCheckbox = document.querySelector(`[value="fantasy"]`)
      const firstRadio = document.querySelector(`[value="true"]`)

      const inputRules1 = new InputRules(firstCheckbox)
      inputRules1.rules.required = true
      const inputRules2 = new InputRules(firstRadio)
      inputRules2.rules.required = true

      const inputRulesArray = [inputRules1, inputRules2]

      const inputErrorsArray = validationProcessor.validate(inputRulesArray)

      expect(inputErrorsArray[0].input).toEqual(firstCheckbox)
      expect(inputErrorsArray[0].errors[0]).toBeNull()
      expect(inputErrorsArray[1].input).toEqual(firstRadio)
      expect(inputErrorsArray[1].errors[0]).toBeNull()
    })

    it('when you pass an inputRulesArray which contains InputRules instances of both single inputs and group inputs that have required rule and failed to meet it, it should return correct inputErrorsArray', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required>
          <input type = "checkbox" name = "genres" value = "fantasy" required>
        </form>
      `
      const singleInput = document.querySelector(`[name="title"]`)
      const inputRules1 = new InputRules(singleInput)
      inputRules1.rules.required = true

      const checkbox = document.querySelector(`[name="genres"]`)
      const inputRules2 = new InputRules(checkbox)
      inputRules2.rules.required = true

      const inputRulesArray = [inputRules1, inputRules2]

      const inputErrorsArray = validationProcessor.validate(inputRulesArray)

      expect(inputErrorsArray[0].input).toEqual(singleInput)
      expect(inputErrorsArray[0].errors[0]).toBeTruthy()
      expect(inputErrorsArray[1].input).toEqual(checkbox)
      expect(inputErrorsArray[1].errors[0]).toBeTruthy()
    })
  })
})
