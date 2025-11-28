import { IS_ERRORS_RENDERER_BASE_INSTANCE } from '../abstracts/validation/ErrorsRendererBase.js'
import { IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE } from '../abstracts/validation/ObjArgValidatorBase.js'
import { IS_SCHEMA_PARSER_BASE_INSTANCE } from '../abstracts/validation/SchemaParserBase.js'
import { IS_VALIDATION_PROCESSOR_BASE_INSTANCE } from '../abstracts/validation/ValidationProcessorBase.js'
import ValidatorConfigSchema, {
  IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE,
} from './ValidatorConfigSchema.js'

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

  validate(form) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('You need to pass form element to first parameter')
    }
  }
}

export default FormValidator
