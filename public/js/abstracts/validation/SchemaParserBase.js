const { IS_SCHEMA_PARSER_BASE_INSTANCE } = Symbol(
  'SchemaParserBase/is-instance'
)

class SchemaParserBase {
  constructor() {
    if (new.target === SchemaParserBase) {
      throw new Error('You cannot directly instantiate SchemaParserBase')
    }
    this[IS_SCHEMA_PARSER_BASE_INSTANCE] = true
  }

  parse() {
    throw new Error('parse() needs to be implemented in subclass')
  }
}

export default SchemaParserBase
export { IS_SCHEMA_PARSER_BASE_INSTANCE }
