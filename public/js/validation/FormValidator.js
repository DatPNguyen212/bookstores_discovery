import { IS_ERRORS_RENDERER_BASE_INSTANCE } from '../abstracts/validation/ErrorsRendererBase.js'
import { IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE } from '../abstracts/validation/ObjArgValidatorBase.js'
import { IS_SCHEMA_PARSER_BASE_INSTANCE } from '../abstracts/validation/SchemaParserBase.js'
import { IS_VALIDATION_PROCESSOR_BASE_INSTANCE } from '../abstracts/validation/ValidationProcessorBase.js'
import { IS_VALIDATION_SCHEMA_INSTANCE } from './ValidationSchema.js'

class FormValidator {
  constructor(
    schemaParser,
    validationProcessor,
    errorsRenderer,
    objArgValidator
  ) {
    if (!schemaParser?.[IS_SCHEMA_PARSER_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of SchemaParserBase to 1st param'
      )
    }

    if (!validationProcessor?.[IS_VALIDATION_PROCESSOR_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of ValidationProcessorBase to 2nd parameter'
      )
    }

    if (!errorsRenderer?.[IS_ERRORS_RENDERER_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of ErrorsRendererBase to 3rd parameter'
      )
    }

    if (!objArgValidator?.[IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass an instance of ObjArgValidatorBase to 4th parameter'
      )
    }

    this.schemaParser = schemaParser
    this.validationProcessor = validationProcessor
    this.errorsRenderer = errorsRenderer
    this.objArgValidator = objArgValidator
  }

  validate(form, schema, options) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('You need to pass form element to first parameter')
    }

    if (!schema?.[IS_VALIDATION_SCHEMA_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of ValidationSchema to 2nd parameter'
      )
    }

    const error = this.objArgValidator.options.validate(options)

    if (error) {
      throw error
    }

    const inputRulesArray = this.schemaParser.parse(form, schema)

    const inputErrorsArray = this.validationProcessor.validate(inputRulesArray)

    this.errorsRenderer.render(inputErrorsArray, options)
  }
}

export default FormValidator
