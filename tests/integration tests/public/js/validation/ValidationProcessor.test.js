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
    singleValidator = new SingleValidator(inputErrorsFactory)
    groupValidator = new GroupValidator(inputErrorsFactory)
    validationProcessor = new ValidationProcessor(
      singleValidator,
      groupValidator
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('validationProcessor.validate()', () => {
    it('when you pass inputRulesArray which only contains InputRules instances for single input elements with required rule but failed to meet it, it should return correct inputErrorsArray', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required>
          <textarea name = "description" required></textarea>
        </form>
      `
      const input = document.querySelector('input')
      const textarea = document.querySelector('textarea')
      const inputRules1 = new InputRules(input)
      inputRules1.rules.required = true
      const inputRules2 = new InputRules(textarea)
      inputRules2.rules.required = true
      const inputRulesArray = [inputRules1, inputRules2]

      const inputErrorsArray = validationProcessor.validate(inputRulesArray)

      expect(inputErrorsArray[0].input).toEqual(input)
      expect(inputErrorsArray[0].errors).toBeTruthy()
      expect(inputErrorsArray[1].input).toEqual(textarea)
      expect(inputErrorsArray[1].errors).toBeTruthy()
    })

    it('when you pass inputRulesArray which only contains InputRules instances for single input elements with required rule and successfully meet it, it should return correct inputErrorsArray', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" value = "test" required>
          <textarea name = "description" required>test</textarea>
        </form>
      `
      const input = document.querySelector('input')
      const textarea = document.querySelector('textarea')
      const inputRules1 = new InputRules(input)
      inputRules1.rules.required = true
      const inputRules2 = new InputRules(textarea)
      inputRules2.rules.required = true
      const inputRulesArray = [inputRules1, inputRules2]

      const inputErrorsArray = validationProcessor.validate(inputRulesArray)

      expect(inputErrorsArray[0].input).toEqual(input)
      expect(inputErrorsArray[0].errors).toBeNull()
      expect(inputErrorsArray[1].input).toEqual(textarea)
      expect(inputErrorsArray[1].errors).toBeNull()
    })

    it('when you pass inputRulesArray it sould contain InputRules instances for group inputs with required rule but they fail to meet it, it should return correct inputErrorsArray', () => {
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
      expect(inputErrorsArray[0].errors).toBeTruthy()
      expect(inputErrorsArray[1].input).toEqual(firstRadio)
      expect(inputErrorsArray[1].errors).toBeTruthy()
    })

    it('when you pass inputRulesArray it sould contain InputRules instances for group inputs with required rule and successfully meet it, it should return correct inputErrorsArray', () => {
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
      expect(inputErrorsArray[0].errors).toBeNull()
      expect(inputErrorsArray[1].input).toEqual(firstRadio)
      expect(inputErrorsArray[1].errors).toBeNull()
    })
  })
})
