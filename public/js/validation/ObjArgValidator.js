import ObjArgValidatorBase from '../abstracts/validation/ObjArgValidatorBase.js'
import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../abstracts/validation/SchemaAdataperBase.js'
const IS_OBJ_ARG_VALIDATOR_INSTANCE = Symbol('ObjArgValidator/is-instance')

class ObjArgValidator extends ObjArgValidatorBase {
  constructor(schemaAdapters) {
    super()
    if (!Array.isArray(schemaAdapters)) {
      if (!schemaAdapters?.[IS_SCHEMA_ADAPTER_BASE_INSTANCE]) {
        throw new TypeError('You need to pass intsance of SchemaAdapterBase')
      }
    } else {
      for (let schemaAdapter of schemaAdapters) {
        if (!schemaAdapter?.[IS_SCHEMA_ADAPTER_BASE_INSTANCE]) {
          throw new TypeError(
            'Your array items need to be ALL isntances of SchemaAdapterBase'
          )
        }
      }
    }

    if (!Array.isArray(schemaAdapters)) {
      this[schemaAdapters.paramName] = schemaAdapters.schema
    } else {
      for (let schemaAdapter of schemaAdapters) {
        const paramName = schemaAdapter.paramName
        const schema = schemaAdapter.schema

        const objArgValidatorKeys = Object.keys(this)

        for (let key of objArgValidatorKeys) {
          if (key === paramName) {
            throw new TypeError(
              'There are SchemaAdapterBase instances with the same .paramName value. Each SchemaAdapterBase instance in the array needs to have unique .paramName value'
            )
          }
        }

        this[paramName] = schema
      }
    }

    this[IS_OBJ_ARG_VALIDATOR_INSTANCE] = true
  }
}

export default ObjArgValidator
export { IS_OBJ_ARG_VALIDATOR_INSTANCE }
