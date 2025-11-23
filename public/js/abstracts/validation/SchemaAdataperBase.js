const IS_SCHEMA_ADAPTER_BASE_INSTANCE = Symbol('SchemaAdapterBase/is-instance')
class SchemaAdapterBase {
  constructor() {
    if (new.target === SchemaAdapterBase) {
      throw new Error('SchemaAdapterBase cannot be directly instantiated')
    }
    this[IS_SCHEMA_ADAPTER_BASE_INSTANCE] = true
  }

  validate() {
    throw new Error('validate() needs to be implemented in subclass')
  }
}

export default SchemaAdapterBase
export { IS_SCHEMA_ADAPTER_BASE_INSTANCE }
