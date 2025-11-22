import Joi from 'joi'
import SchemaAdapterBase from '../abstracts/joi/SchemaAdataperBase.js'
import { IS_OPTIONS_JOI_SCHEMA_INSTANCE } from './OptionsJoiSchema.js'

const IS_VALIDATOR_CONFIG_SCHEMA_INSTANCE = Symbol(
  'ValidatorConfigSchema/is-instance'
)

class ValidatorConfigSchema extends SchemaAdapterBase {
  constructor(optionsSchema) {
    super()

    if (!optionsSchema || !optionsSchema[IS_OPTIONS_JOI_SCHEMA_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of SchemaAdapterBase to 1st parameter'
      )
    }

    this.schema = Joi.object({
      asyncUrl: Joi.object({
        isEmailUnique: Joi.string(),
      }),
      errors: optionsSchema.schema,
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
