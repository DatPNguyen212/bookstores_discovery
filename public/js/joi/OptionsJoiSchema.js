import Joi from 'joi'
import SchemaAdapterBase from '../abstracts/joi/SchemaAdataperBase.js'

class OptionsJoiSchema extends SchemaAdapterBase {
  constructor() {
    super()

    this.schema = Joi.object({
      tagName: Joi.string(),
      class: Joi.string(),
      id: Joi.string(),
      style: Joi.object().pattern(Joi.string(), Joi.string()),
    })
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
