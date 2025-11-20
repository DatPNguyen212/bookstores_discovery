// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import FormValidator from '../../../../../public/js/validation/FormValidator.js'
import { IS_SCHEMA_PARSER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/SchemaParserBase.js'
import { IS_VALIDATION_PROCESSOR_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ValidationProcessorBase.js'
import { IS_ERRORS_RENDERER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ErrorsRendererBase.js'
import { Window } from 'happy-dom'
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
  let formValidator

  beforeEach(() => {
    SchemaParserMock = vi.fn(function () {
      this[IS_SCHEMA_PARSER_BASE_INSTANCE] = true
    })
    schemaParserMock = new SchemaParserMock()

    ValidationProcessorMock = vi.fn(function () {
      this[IS_VALIDATION_PROCESSOR_BASE_INSTANCE] = true
    })
    validationProcessorMock = new ValidationProcessorMock()

    ErrorsRendererMock = vi.fn(function () {
      this[IS_ERRORS_RENDERER_BASE_INSTANCE] = true
    })
    errorsRendererMock = new ErrorsRendererMock()

    formValidator = new FormValidator(
      schemaParserMock,
      validationProcessorMock,
      errorsRendererMock
    )
  })
  it('when you pass a non instance of SchemaPasrerBase to 1st param, it should throw an error', () => {
    const schemaParser = 3

    const fn = () => {
      new FormValidator(
        schemaParser,
        validationProcessorMock,
        errorsRendererMock
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
        errorsRendererMock
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
        errorsRenderer
      )
    }

    expect(fn).toThrow(
      'You need to pass instance of ErrorsRendererBase to 3rd parameter'
    )
  })

  it('when you pass valid dependencies to constructor, the instance should correctly store those dependencies in its properties', () => {
    const result = new FormValidator(
      schemaParserMock,
      validationProcessorMock,
      errorsRendererMock
    )

    expect(result.schemaParser).toEqual(schemaParserMock)
    expect(result.validationProcessor).toEqual(validationProcessorMock)
    expect(result.errorsRenderer).toEqual(errorsRendererMock)
  })

  describe('formValidator.validate()', () => {
    it("when you don't pass form element to 1st param, it should throw an error", () => {
      const form = 3

      const fn = () => {
        formValidator.validate(form)
      }

      expect(fn).toThrow('You need to pass form element to first parameter')
    })
  })
})
