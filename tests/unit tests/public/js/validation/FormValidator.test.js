// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FormValidator from '../../../../../public/js/validation/FormValidator.js'
import { IS_SCHEMA_PARSER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaParserBase.js'
import { IS_VALIDATION_PROCESSOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ValidationProcessorBase.js'
import { IS_ERRORS_RENDERER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ErrorsRendererBase.js'
import ValidatorConfigSchema from '../../../../../public/js/validation/ValidatorConfigSchema.js'
import { Window } from 'happy-dom'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'
import { IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE } from '../../../../../public/js/validation/ValidatorConfigSchema.js'
import { IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ObjArgValidatorBase.js'
import ValidationSchema, {
  IS_VALIDATION_SCHEMA_INSTANCE,
} from '../../../../../public/js/validation/ValidationSchema.js'
const window = new Window()
const document = window.document

vi.stubGlobal('document', document)
vi.stubGlobal('HTMLFormElement', window.HTMLFormElement)

describe('FormValidator', () => {
  let SchemaParserMock
  let schemaParserMock
  let ValidationProcessorMock
  let validationProcessorMock
  let ErrorsRendererMock
  let errorsRendererMock
  let ObjArgValidatorMock
  let objArgValidatorMock
  let formValidator

  beforeEach(() => {
    document.body.innerHTML = ''
    SchemaParserMock = vi.fn(function () {
      this[IS_SCHEMA_PARSER_BASE_INSTANCE] = true
      this.parse = vi.fn()
    })
    schemaParserMock = new SchemaParserMock()

    ValidationProcessorMock = vi.fn(function () {
      this[IS_VALIDATION_PROCESSOR_BASE_INSTANCE] = true
      this.validate = vi.fn()
    })
    validationProcessorMock = new ValidationProcessorMock()

    ErrorsRendererMock = vi.fn(function () {
      this[IS_ERRORS_RENDERER_BASE_INSTANCE] = true
      this.render = vi.fn()
    })
    errorsRendererMock = new ErrorsRendererMock()

    ObjArgValidatorMock = vi.fn(function () {
      this[IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE] = true
      this.config = {
        validate: vi.fn(function () {
          return null
        }),
      }
    })

    objArgValidatorMock = new ObjArgValidatorMock()

    formValidator = new FormValidator(
      schemaParserMock,
      validationProcessorMock,
      errorsRendererMock,
      objArgValidatorMock
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('when you pass a non instance of SchemaPasrerBase to 1st param, it should throw an error', () => {
    const schemaParser = 3

    const fn = () => {
      new FormValidator(
        schemaParser,
        validationProcessorMock,
        errorsRendererMock,
        objArgValidatorMock
      )
    }

    expect(fn).toThrow(
      'You need to pass instance of SchemaParserBase to 1st param'
    )
  })

  it('when you pass a non instance of ValidationProcessorBase to 2nd param, it should throw an error', () => {
    const validationProcessor = 3

    const fn = () => {
      new FormValidator(
        schemaParserMock,
        validationProcessor,
        errorsRendererMock,
        objArgValidatorMock
      )
    }

    expect(fn).toThrow(
      'You need to pass instance of ValidationProcessorBase to 2nd parameter'
    )
  })

  it('when you pass a non instance of ErrorsRendererBase to 3rd param, it should throw an error', () => {
    const errorsRenderer = 3

    const fn = () => {
      new FormValidator(
        schemaParserMock,
        validationProcessorMock,
        errorsRenderer,
        objArgValidatorMock
      )
    }

    expect(fn).toThrow(
      'You need to pass instance of ErrorsRendererBase to 3rd parameter'
    )
  })

  it('when you pass a non instance of ObjArgValidatorBase in 4th param, it should throw an error', () => {
    const objArgValidator = 3

    const fn = () => {
      new FormValidator(
        schemaParserMock,
        validationProcessorMock,
        errorsRendererMock,
        objArgValidator
      )
    }

    expect(fn).toThrow(
      'You need to pass an instance of ObjArgValidatorBase to 4th parameter'
    )
  })

  it('when you pass valid dependencies to constructor, the instance should correctly store those dependencies in its properties', () => {
    const result = new FormValidator(
      schemaParserMock,
      validationProcessorMock,
      errorsRendererMock,
      objArgValidatorMock
    )

    expect(result.schemaParser).toEqual(schemaParserMock)
    expect(result.validationProcessor).toEqual(validationProcessorMock)
    expect(result.errorsRenderer).toEqual(errorsRendererMock)
    expect(result.objArgValidator).toEqual(objArgValidatorMock)
  })

  describe('formValidator.validate()', () => {
    let formMock
    let ValidationSchemaMock
    let schemaMock
    let configMock
    beforeEach(() => {
      formMock = document.createElement('form')
      ValidationSchemaMock = vi.fn(function () {
        this[IS_VALIDATION_SCHEMA_INSTANCE] = true
      })

      schemaMock = new ValidationSchemaMock()

      configMock = {
        async: {
          isEmailUnique: 'url',
        },
        errprs: {
          tagName: 'test',
          class: 'testClass',
          id: 'testId',
          style: {
            color: 'black',
            fontSize: '16px',
          },
        },
      }
    })
    it("when you don't pass form element to 1st param, it should throw an error", () => {
      const form = 3

      const fn = () => {
        formValidator.validate(form, schemaMock)
      }

      expect(fn).toThrow('You need to pass form element to first parameter')
    })

    it('when you pass a non instance of ValidationSchema to 2nd param, it should throw an error', () => {
      const schema = {}

      const fn = () => {
        formValidator.validate(formMock, schema)
      }

      expect(fn).toThrow(
        'You need to pass instance of ValidationSchema to 2nd parameter'
      )
    })

    it('given objArgValidator.config.validate is mocked, it should call that method with config argument', () => {
      const form = document.createElement('form')
      const schema = new ValidationSchema({
        title: {
          required: true,
        },
      })
      const config = {
        errors: {
          tagName: 'div',
        },
      }

      const result = formValidator.validate(form, schema, config)

      expect(objArgValidatorMock.config.validate).toBeCalledWith(config)
    })

    it('given objArgValidatorMock.config.validate returns an error, it should throw that error', () => {
      const errorMock = new Error('test')
      objArgValidatorMock.config = {
        validate: vi.fn(function () {
          return errorMock
        }),
      }

      const formValidator = new FormValidator(
        schemaParserMock,
        validationProcessorMock,
        errorsRendererMock,
        objArgValidatorMock
      )

      const fn = () => {
        formValidator.validate(formMock, schemaMock, configMock)
      }

      expect(fn).toThrowError(errorMock)
    })

    it('given schemaParser.parse, validationProcessor.validate and errorsRenderer.render are mocked, when you pass valid form, schema and config, it should call the correct functions with correct arguments', () => {
      document.body.innerHTML = `
        <form>
          <fieldset>
            <input type = "text" name = "title" required>
          </fieldset>

          <fieldset>
            <input type = "email" name = "email" required>
          </fieldset>
        </form>
      `

      const form = document.querySelector('form')

      const input1 = document.querySelector(`[name="title"]`)
      const input2 = document.querySelector(`[name="email"]`)

      const schema = new ValidationSchema({
        title: {
          required: true,
        },
        email: {
          required: true,
          isEmailUnique: 'url',
        },
      })

      const config = {
        tagName: 'div',
      }

      const inputRules1 = {
        input: input1,
        rules: {
          ...schema.title,
        },
      }

      const inputRules2 = {
        input: input2,
        rules: {
          ...schema.description,
        },
      }

      const inputRulesArray = [inputRules1, inputRules2]

      const inputErrors1 = {
        input: input1,
        errors: ['test'],
      }

      const inputErrors2 = {
        input: input2,
        errors: ['test'],
      }

      const inputErrorsArray = [inputErrors1, inputErrors2]

      schemaParserMock.parse = vi.fn().mockReturnValue(inputRulesArray)

      validationProcessorMock.validate = vi
        .fn()
        .mockReturnValue(inputErrorsArray)

      errorsRendererMock.render = vi.fn()

      formValidator.validate(form, schema, config)

      expect(schemaParserMock.parse).toBeCalledWith(form, schema)

      expect(validationProcessorMock.validate).toBeCalledWith(inputRulesArray)

      expect(errorsRendererMock.render).toBeCalledWith(inputErrorsArray, config)
    })
  })
})
