import Joi from 'joi'
import SchemaAdapterBase from '../abstracts/joi/SchemaAdataperBase.js'
const IS_OPTIONS_JOI_SCHEMA_INSTANCE = Symbol('OptionsJoiSchema/is-instance')
class OptionsJoiSchema extends SchemaAdapterBase {
  constructor() {
    super()

    this.schema = Joi.object({
      tagName: Joi.string(),
      class: Joi.string(),
      id: Joi.string(),
      style: Joi.object().pattern(Joi.string(), Joi.string()),
    })

    this[IS_OPTIONS_JOI_SCHEMA_INSTANCE] = true
  }

  validate(options) {
    const { error } = this.schema.validate(options)

    if (error) {
      return error
    } else {
      return null
    }
  }
}

export default OptionsJoiSchema
export { IS_OPTIONS_JOI_SCHEMA_INSTANCE }
