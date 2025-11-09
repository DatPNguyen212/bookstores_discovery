// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ValidationProcessor from '../../../../../public/js/validation/ValidationProcessor.js'
import { IS_SINGLE_VALIDATOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SingleValidatorBase.js'
import SingleValidator from '../../../../../public/js/validation/SingleValidator.js'
import InputErrorFactory from '../../../../../public/js/validation/InputErrorFactory.js'
import { Window } from 'happy-dom'
import InputError from '../../../../../public/js/validation/InputError.js'
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
  let inputErrorFactory
  let groupValidator
  let validationProcessor
  beforeEach(() => {
    document.body.innerHTML = ''
    inputErrorFactory = new InputErrorFactory()
    singleValidator = new SingleValidator(inputErrorFactory)
    groupValidator = new GroupValidator(inputErrorFactory)
    validationProcessor = new ValidationProcessor(
      singleValidator,
      groupValidator
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass a non instance of SingleValidatorBase, it should throw an error', () => {
    const singleValidator = 3

    const fn = () => {
      new ValidationProcessor(singleValidator, groupValidator)
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
      new ValidationProcessor(singleValidator, groupValidator)
    }

    expect(fn).toThrow(
      'You need to pass instance of GroupValidatorBase in 2nd parameter'
    )
  })

  it('when you pass valid singleValidator and groupValidator to constructor, the instance must store those arguments as properties', () => {
    const validationProcessor = new ValidationProcessor(
      singleValidator,
      groupValidator
    )

    expect(validationProcessor.singleValidator).toEqual(singleValidator)
    expect(validationProcessor.groupValidator).toEqual(groupValidator)
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

    it('given singleValidator is mocked and passed to constructor, when you pass inputRulesArray of single inputs inputRules only with either required and maxLength rules, validationProcessor.validate() should call singleValidatorMock.required(true) and singleValidatorMock.maxLength(maxLengthValue)', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required>
          <input type = "text" name = "description" maxLength = "3">
        </form>
      `
      const input1 = document.querySelector(`[name="title"]`)
      const input2 = document.querySelector(`[name="description"]`)
      const inputRules1 = new InputRules(input1)
      inputRules1.rules.required = true
      const inputRules2 = new InputRules(input2)
      inputRules2.rules.maxLength = 3
      const inputRulesArray = [inputRules1, inputRules2]
      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
        maxLength: vi.fn(),
      }
      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidator
      )

      const inputErrorArray = validationProcessor.validate(inputRulesArray)

      expect(singleValidatorMock.required).toBeCalledWith(input1, true)
      expect(singleValidatorMock.maxLength).toBeCalledWith(input2, 3)
    })

    it('given each singleValidator methods is mocked to return InputError instance and singleValidator is passed to constructor, when you pass inputRulesArray of singe inputs inputRules only with either required and maxLength rules, validationProcessor.validate() should return an array of those InputError instances', () => {
      document.body.innerHTML = `
        <form>
          <input type = "text" name = "title" required>
          <input type = "text" name = "description" maxLength = "3">
        </form>
      `
      const input1 = document.querySelector(`[name="title"]`)
      const input2 = document.querySelector(`[name="description"]`)
      const inputRules1 = new InputRules(input1)
      inputRules1.rules.required = true
      const inputRules2 = new InputRules(input2)
      inputRules2.rules.maxLength = 3
      const inputRulesArray = [inputRules1, inputRules2]
      const inputErrorMock = new InputError(input1)
      inputErrorMock.error = 'msg'
      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(() => {
          return inputErrorMock
        }),
        maxLength: vi.fn(() => {
          return inputErrorMock
        }),
      }
      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidator
      )

      const inputErrorArray = validationProcessor.validate(inputRulesArray)

      const expectedResult = [inputErrorMock, inputErrorMock]
      expect(inputErrorArray).toEqual(expectedResult)
    })

    it('given groupValidator is mocked and passed to constructor, when you pass inputRulesArray of a checkbox inputRules with required rule, validationProcessor.validate() should call groupValidator.required() with that checkbox element', () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "genres" value = "fantasy" required>
        </form>
      `
      const checkbox = document.querySelector(`[value="fantasy"]`)
      const inputRules = new InputRules(checkbox)
      inputRules.rules.required = true

      const inputRulesArray = [inputRules]
      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
        maxLength: vi.fn(),
      }
      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
      }
      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidatorMock
      )

      const inputErrorArray = validationProcessor.validate(inputRulesArray)

      expect(groupValidatorMock.required).toBeCalledWith(checkbox)
    })

    it('given each of groupValidator methods is mocked to return an InputError instance and groupValidator is passed to constructor, when you pass inputRulesArray of a checkbox inputRules with required rule, validationProcessor.validate() should return an array of the InputError instances returned by the mocked methods', () => {
      document.body.innerHTML = `
        <form>
          <input type = "checkbox" name = "genres" value = "fantasy" required>
        </form>
      `
      const checkbox = document.querySelector(`[value="fantasy"]`)
      const inputRules = new InputRules(checkbox)
      inputRules.rules.required = true

      const inputRulesArray = [inputRules]
      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
        maxLength: vi.fn(),
      }
      const inputErrorMock = new InputError(checkbox)

      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(() => {
          return inputErrorMock
        }),
      }
      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidatorMock
      )

      const inputErrorArray = validationProcessor.validate(inputRulesArray)

      const expectedResult = [inputErrorMock]
      expect(inputErrorArray).toEqual(expectedResult)
    })

    it('given groupValidator is mocked and passed to constructor, when you pass inputRulesArray of a radio inputRules with required rule, validationProcessor.validate() should call groupValidator.required() with that radio element', () => {
      document.body.innerHTML = `
        <form>
          <input type = "radio" name = "genres" value = "fantasy" required>
        </form>
      `
      const radio = document.querySelector(`[value="fantasy"]`)
      const inputRules = new InputRules(radio)
      inputRules.rules.required = true

      const inputRulesArray = [inputRules]
      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
        maxLength: vi.fn(),
      }
      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
      }
      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidatorMock
      )

      const inputErrorArray = validationProcessor.validate(inputRulesArray)

      expect(groupValidatorMock.required).toBeCalledWith(radio)
    })

    it('given groupValidator is mocked and passed to constructor, when you pass inputRulesArray of a radio inputRules with required rule, validationProcessor.validate() should call groupValidator.required() with that radio element', () => {
      document.body.innerHTML = `
        <form>
          <input type = "radio" name = "genres" value = "fantasy" required>
        </form>
      `
      const radio = document.querySelector(`[value="fantasy"]`)
      const inputRules = new InputRules(radio)
      inputRules.rules.required = true

      const inputRulesArray = [inputRules]
      const singleValidatorMock = {
        [IS_SINGLE_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(),
        maxLength: vi.fn(),
      }
      const inputErrorMock = new InputError(radio)
      const groupValidatorMock = {
        [IS_GROUP_VALIDATOR_BASE_INSTANCE]: true,
        required: vi.fn(() => {
          return inputErrorMock
        }),
      }
      const validationProcessor = new ValidationProcessor(
        singleValidatorMock,
        groupValidatorMock
      )

      const inputErrorArray = validationProcessor.validate(inputRulesArray)

      const expectedResult = [inputErrorMock]
      expect(inputErrorArray).toEqual(expectedResult)
    })
  })
})
