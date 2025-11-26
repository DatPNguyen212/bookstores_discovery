import Joi from 'joi'
import SchemaAdapterBase from '../abstracts/validation/SchemaAdataperBase.js'
import { IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE } from './CreateTextOptsSchema.js'

const IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE = Symbol(
  'ValidatorConfigSchema/is-instance'
)

class ValidatorConfigSchema extends SchemaAdapterBase {
  constructor(paramName, createTextOptsSchema) {
    super()

    if (typeof paramName !== 'string') {
      throw new TypeError(
        'You need to pass string data type to first parameter'
      )
    }

    if (!createTextOptsSchema?.[IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of SchemaAdapterBase to 1st parameter'
      )
    }

    this.paramName = paramName
    this.schema = Joi.object({
      asyncUrl: Joi.object({
        isEmailUnique: Joi.string(),
      }),
      errors: createTextOptsSchema.schema,
    })

    this[IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE] = true
  }

  validate(obj) {
    const { error } = this.schema.validate(obj)

    if (error) {
      return error
    } else {
      return null
    }
  }
}

export default ValidatorConfigSchema
export { IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE }
