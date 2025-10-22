import typeCheck from '../../utils/typeCheck.js'
class FieldRulesExtracter {
  constructor() {}

  extractSingleType(input) {
    if (!typeCheck.isSingleInputType(input)) {
      throw new TypeError(
        'You need to pass either input, textarea or select element'
      )
    }
    const result = {
      input: input,
      rules: {},
    }
    if (input.required === true) {
      result.rules.required = true
    }

    if (input.maxLength !== -1 && !Number.isNaN(input.maxLength)) {
      result.rules.maxLength = input.maxLength
    }

    return result
  }
}

export default FieldRulesExtracter
