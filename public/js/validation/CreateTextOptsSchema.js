import Joi from 'joi'
import SchemaAdapterBase from '../abstracts/validation/SchemaAdataperBase.js'
const IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE = Symbol(
  'CreateTextOptsSchema/is-instance'
)
class CreateTextOptsSchema extends SchemaAdapterBase {
  constructor() {
    super()

    this.schema = Joi.object({
      tagName: Joi.string(),
      class: Joi.string(),
      id: Joi.string(),
      style: Joi.object().pattern(Joi.string(), Joi.string()),
    })

    this[IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE] = true
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

export default CreateTextOptsSchema
export { IS_CREATE_TEXT_OPTS_SCHEMA_INSTANCE }
