import { IS_SCHEMA_ADAPTER_BASE_INSTANCE } from '../abstracts/validation/SchemaAdataperBase.js'

class ObjArgValidator {
  constructor(schemaAdapters) {
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
      this.schema = schemaAdapters
    } else {
      this.schemas = schemaAdapters
    }
  }
}

export default ObjArgValidator
