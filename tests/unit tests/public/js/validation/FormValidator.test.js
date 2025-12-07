// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FormValidator from '../../../../../public/js/validation/FormValidator.js'
import { IS_SCHEMA_PARSER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaParserBase.js'
import { IS_VALIDATION_PROCESSOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ValidationProcessorBase.js'
import { IS_ERRORS_RENDERER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ErrorsRendererBase.js'
import { Window } from 'happy-dom'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'
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

  let form
  let input1
  let input2
  let schema
  let options
  let inputRules1
  let inputRules2
  let inputRulesArray
  let inputErrors1
  let inputErrors2
  let inputErrorsArray
  beforeEach(() => {
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

    form = document.querySelector('form')

    input1 = document.querySelector(`[name="title"]`)
    input2 = document.querySelector(`[name="email"]`)

    schema = new ValidationSchema({
      title: {
        required: true,
      },
      email: {
        required: true,
        isEmailUnique: 'url',
      },
    })

    options = {
      tagName: 'div',
    }

    inputRules1 = {
      input: input1,
      rules: {
        ...schema.title,
      },
    }

    inputRules2 = {
      input: input2,
      rules: {
        ...schema.description,
      },
    }

    inputRulesArray = [inputRules1, inputRules2]

    inputErrors1 = {
      input: input1,
      errors: ['test'],
    }

    inputErrors2 = {
      input: input2,
      errors: ['test'],
    }

    inputErrorsArray = [inputErrors1, inputErrors2]

    SchemaParserMock = vi.fn(function () {
      this[IS_SCHEMA_PARSER_BASE_INSTANCE] = true
      this.parse = vi.fn(() => {
        return inputRulesArray
      })
    })
    schemaParserMock = new SchemaParserMock()

    ValidationProcessorMock = vi.fn(function () {
      this[IS_VALIDATION_PROCESSOR_BASE_INSTANCE] = true
      this.validate = vi.fn(() => {
        return inputErrorsArray
      })
    })
    validationProcessorMock = new ValidationProcessorMock()

    ErrorsRendererMock = vi.fn(function () {
      this[IS_ERRORS_RENDERER_BASE_INSTANCE] = true
      this.render = vi.fn()
    })
    errorsRendererMock = new ErrorsRendererMock()

    ObjArgValidatorMock = vi.fn(function () {
      this[IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE] = true
      this.options = {
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
    let optionsMock
    beforeEach(() => {
      formMock = document.createElement('form')
      ValidationSchemaMock = vi.fn(function () {
        this[IS_VALIDATION_SCHEMA_INSTANCE] = true
      })

      schemaMock = new ValidationSchemaMock()

      optionsMock = {
        tagName: 'test',
        class: 'testClass',
        id: 'testId',
        style: {
          color: 'black',
          fontSize: '16px',
        },
      }
    })
    it("when you don't pass form element to 1st param, it should throw an error", () => {
      const form = 3

      const fn = () => {
        formValidator.validate(form, schemaMock, optionsMock)
      }

      expect(fn).toThrow('You need to pass form element to first parameter')
    })

    it('when you pass a non instance of ValidationSchema to 2nd param, it should throw an error', () => {
      const schema = {}

      const fn = () => {
        formValidator.validate(formMock, schema, optionsMock)
      }

      expect(fn).toThrow(
        'You need to pass instance of ValidationSchema to 2nd parameter'
      )
    })

    it('given objArgValidator.options.validate is mocked, it should call that method with options argument', () => {
      const form = document.createElement('form')
      const schema = new ValidationSchema({
        title: {
          required: true,
        },
      })
      const options = {
        tagName: 'div',
      }

      const result = formValidator.validate(form, schema, options)

      expect(objArgValidatorMock.options.validate).toBeCalledWith(options)
    })

    it('given objArgValidatorMock.options.validate returns an error, it should throw that error', () => {
      const errorMock = new Error('test')
      objArgValidatorMock.options = {
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
        formValidator.validate(formMock, schemaMock, optionsMock)
      }

      expect(fn).toThrowError(errorMock)
    })

    it('given schemaParser.parse, validationProcessor.validate and errorsRenderer.render are mocked, when you pass valid form, schema and options with no missing properties, it should call the correct functions with correct arguments', () => {
      const options = {
        tagName: 'div',
        class: 'error',
        id: '',
        style: {
          color: 'black',
          fontSize: '16px',
        },
      }
      formValidator.validate(form, schema, options)

      expect(schemaParserMock.parse).toBeCalledWith(form, schema)

      expect(validationProcessorMock.validate).toBeCalledWith(inputRulesArray)

      expect(errorsRendererMock.render).toBeCalledWith(
        inputErrorsArray,
        options
      )
    })

    describe('Tests to check if correct default values are applied to propeties of the obj parameter', () => {
      it("when you don't pass any value to options param, it should call errorsRenderer.render() with correct inputErrorsArray and correct default options obj", () => {
        const expectedOptions = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            color: 'red',
            fontSize: '16px',
          },
        }

        formValidator.validate(form, schema)

        expect(errorsRendererMock.render).toBeCalledWith(
          inputErrorsArray,
          expectedOptions
        )
      })

      it('when you pass options obj where its tagName property is missing to 3rd param, it should call errorsRenderer.render() with correct inputErrorsArray and that same options obj but with default tagName value', () => {
        const options = {
          class: 'error',
          id: '',
          style: {
            color: 'black',
            fontSize: '16px',
          },
        }

        const expectedOptions = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            color: 'black',
            fontSize: '16px',
          },
        }

        formValidator.validate(form, schema, options)

        expect(errorsRendererMock.render).toBeCalledWith(
          inputErrorsArray,
          expectedOptions
        )
      })

      it('when you pass options obj where its class property is missing to 3rd param, it should call errorsRenderer.render() with correct inputErrorsArray and that same options obj but with default class value', () => {
        const options = {
          tagName: 'div',
          id: '',
          style: {
            color: 'black',
            fontSize: '16px',
          },
        }

        const expectedOptions = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            color: 'black',
            fontSize: '16px',
          },
        }

        formValidator.validate(form, schema, options)

        expect(errorsRendererMock.render).toBeCalledWith(
          inputErrorsArray,
          expectedOptions
        )
      })

      it('when you pass options obj where its id property is missing to 3rd param, it should call errorsRenderer.render() with correct inputErrorsArray and that same options obj but with default id value', () => {
        const options = {
          tagName: 'div',
          class: 'error',
          style: {
            color: 'black',
            fontSize: '16px',
          },
        }

        const expectedOptions = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            color: 'black',
            fontSize: '16px',
          },
        }

        formValidator.validate(form, schema, options)

        expect(errorsRendererMock.render).toBeCalledWith(
          inputErrorsArray,
          expectedOptions
        )
      })

      it('when you pass options obj where its style property is missing to 3rd param, it should call errorsRenderer.render() with correct inputErrorsArray and that same options obj but with default style properties values', () => {
        const options = {
          tagName: 'div',
          class: 'error',
          id: '',
        }

        const expectedOptions = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            color: 'red',
            fontSize: '16px',
          },
        }

        formValidator.validate(form, schema, options)

        expect(errorsRendererMock.render).toBeCalledWith(
          inputErrorsArray,
          expectedOptions
        )
      })

      it('when you pass options obj where its style.color property is missing to 3rd param, it should call errorsRenderer.render() with correct inputErrorsArray and that same options obj but with default style.color value', () => {
        const options = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            fontSize: '16px',
          },
        }

        const expectedOptions = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            color: 'red',
            fontSize: '16px',
          },
        }

        formValidator.validate(form, schema, options)

        expect(errorsRendererMock.render).toBeCalledWith(
          inputErrorsArray,
          expectedOptions
        )
      })

      it('when you pass options obj where its style.fontSize property is missing to 3rd param, it should call errorsRenderer.render() with correct inputErrorsArray and that same options obj but with default style.fontSize value', () => {
        const options = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            color: 'red',
          },
        }

        const expectedOptions = {
          tagName: 'div',
          class: 'error',
          id: '',
          style: {
            color: 'red',
            fontSize: '16px',
          },
        }

        formValidator.validate(form, schema, options)

        expect(errorsRendererMock.render).toBeCalledWith(
          inputErrorsArray,
          expectedOptions
        )
      })
    })
  })
})
