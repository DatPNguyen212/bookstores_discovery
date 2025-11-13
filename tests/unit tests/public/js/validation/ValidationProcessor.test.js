// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ValidationProcessor from '../../../../../public/js/validation/ValidationProcessor.js'
import { IS_SINGLE_VALIDATOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SingleValidatorBase.js'
import SingleValidator from '../../../../../public/js/validation/SingleValidator.js'
import InputErrorsFactory from '../../../../../public/js/validation/InputErrorsFactory.js'
import { Window } from 'happy-dom'
import InputErrors from '../../../../../public/js/validation/InputErrors.js'
import GroupValidator from '../../../../../public/js/validation/GroupValidator.js'
import InputRules from '../../../../../public/js/validation/InputRules.js'
import SchemaParser from '../../../../../public/js/validation/SchemaParser.js'
import FormInputExtracter from '../../../../../public/js/validation/FormInputExtracter.js'
import InputRulesFactory from '../../../../../public/js/validation/InputRulesFactory.js'
import ValidationSchema from '../../../../../public/js/validation/ValidationSchema.js'
import { IS_GROUP_VALIDATOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/GroupValidatorBase.js'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)
vi.stubGlobal('HTMLFormElement', window.HTMLFormElement)

describe('ValidationProcessor', () => {
  let singleValidator
  let inputErrorsFactory
  let groupValidator
  let validationProcessor
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
  it('when you pass a non instance of SingleValidatorBase, it should throw an error', () => {
    const singleValidator = 3

    const fn = () => {
      new ValidationProcessor(
        singleValidator,
        groupValidator,
        inputErrorsFactory
      )
    }

    expect(fn).toThrow(
      'You need to pass instance of SingleValidatorBase to first parameter'
    )
  })

  it("when you don't pass any value to first parameter, it should throw an error", () => {
    const fn = () => {
      new ValidationProcessor()
    }

    expect(fn).toThrow(
      'You need to pass instance of SingleValidatorBase to first parameter'
    )
  })

  it('when you pass a non instance of GroupValidatorBase in 2nd param, it should throw an error', () => {
    const groupValidator = 3

    const fn = () => {
      new ValidationProcessor(
        singleValidator,
        groupValidator,
        inputErrorsFactory
      )
    }

    expect(fn).toThrow(
      'You need to pass instance of GroupValidatorBase in 2nd parameter'
    )
  })

  it('when you pass valid singleValidator, groupValidator, inputErrorsFactory to constructor, the instance must store those arguments as properties', () => {
    const validationProcessor = new ValidationProcessor(
      singleValidator,
      groupValidator,
      inputErrorsFactory
    )

    expect(validationProcessor.singleValidator).toEqual(singleValidator)
    expect(validationProcessor.groupValidator).toEqual(groupValidator)
    expect(validationProcessor.inputErrorsFactory).toEqual(inputErrorsFactory)
  })

  it('when you pass a non instanceof InputErrorsFactoryBase to 3rd param, it should throw an error', () => {
    const inputErrorsFactory = 3

    const fn = () => {
      new ValidationProcessor(
        singleValidator,
        groupValidator,
        inputErrorsFactory
      )
    }

    expect(fn).toThrow(
      'You need to pass an instance of InputErrorsFactoryBase to 3rd parameter'
    )
  })

  describe('validationProcessor.validate()', () => {
    it('when you pass 3 to 1st parameter, it should throw an error', () => {
      const inputRulesArray = 3

      const fn = () => {
        validationProcessor.validate(inputRulesArray)
      }

      expect(fn).toThrow(
        'You need to pass an array of instances of InputRules in 2nd parameter'
      )
    })

    it('when you pass an array where NOT all items are instances of InputRules to 1st param, it should throw an error', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title">
        </form>
      `
      const input = document.querySelector('input')
      const inputRules = new InputRules(input)
      const inputRulesArray = [1, inputRules]

      const fn = () => {
        validationProcessor.validate(inputRulesArray)
      }

      expect(fn).toThrow(
        'You need to pass an array of instances of InputRules in 2nd parameter'
      )
    })
  })
})
