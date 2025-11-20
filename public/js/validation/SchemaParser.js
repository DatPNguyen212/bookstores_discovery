import { IS_INPUT_EXTRACTER_BASE_INSTANCE } from '../abstracts/validation/InputExtracterBase.js'
import { IS_INPUT_RULES_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputRulesFactoryBase.js'
import { IS_VALIDATION_SCHEMA_INSTANCE } from './ValidationSchema.js'
import SchemaParserBase from '../abstracts/validation/SchemaParserBase.js'

class SchemaParser extends SchemaParserBase {
  constructor(inputExtracter, inputRulesFactory) {
    super()
    if (!inputExtracter || !inputExtracter[IS_INPUT_EXTRACTER_BASE_INSTANCE]) {
      throw new TypeError(
        'First parmameter needs an instanceof InputExtracterBase'
      )
    }

    if (
      !inputRulesFactory ||
      !inputRulesFactory[IS_INPUT_RULES_FACTORY_BASE_INSTANCE]
    ) {
      throw new TypeError(
        'Second parameter needs to be instanceof InputRulesFactoryBase'
      )
    }

    this.inputExtracter = inputExtracter
    this.inputRulesFactory = inputRulesFactory
  }

  parse(form, schema) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('You need to pass a form element to first parameter')
    }
    if (!schema[IS_VALIDATION_SCHEMA_INSTANCE]) {
      throw new TypeError('You need to pass an instance of ValidationSchema')
    }

    const inputs = this.inputExtracter.getFormInputs(form)
    const schemaKeys = Object.keys(schema)
    let result = []

    for (let schemaKey of schemaKeys) {
      const inputFound = inputs.find((input) => {
        if (!Array.isArray(input)) {
          return input.name === schemaKey
        } else {
          return input[0].name === schemaKey
        }
      })

      if (inputFound) {
        const rules = schema[schemaKey]
        if (!Array.isArray(inputFound)) {
          const inputRules = this.inputRulesFactory.create(inputFound)
          inputRules.rules = rules
          result.push(inputRules)
        } else {
          const firstGroupInput = inputFound[0]
          const inputRules = this.inputRulesFactory.create(firstGroupInput)
          inputRules.rules = rules
          result.push(inputRules)
        }
      } else {
        throw new TypeError(
          `Cannot find input with name attribute of "${schemaKey}"`
        )
      }
    }

    return result
  }
}

export default SchemaParser
