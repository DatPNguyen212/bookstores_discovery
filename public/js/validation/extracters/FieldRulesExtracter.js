import typeCheck from '../../utils/typeCheck.js'
import { IS_INPUT_RULES_BASE_INSTANCE } from '../../abstracts/validation/InputRulesBase.js'
import objectUtils from '../../utils/objectUtils.js'

class FieldRulesExtracter {
  constructor(extractMethods, inputRules) {
    if (Array.isArray(extractMethods)) {
      for (let method of extractMethods) {
        if (typeof method !== 'function') {
          throw new TypeError(
            'You need to pass an array of functions to first parameter'
          )
        }
      }
    } else {
      throw new TypeError(
        'You need to pass an array of functions to first parameter'
      )
    }

    if (objectUtils.isPlainObject(inputRules)) {
      if (!inputRules[IS_INPUT_RULES_BASE_INSTANCE] === true) {
        throw new TypeError(
          'You need to pass an instance of InputRulesBase to 2nd parameter'
        )
      }
    } else {
      throw new TypeError(
        'You need to pass an instance of InputRulesBase to 2nd parameter'
      )
    }

    this.extractMethods = extractMethods
    this.inputRules = inputRules
    this.input = inputRules.input
  }

  extractSingleType() {
    let inputRules = {
      input: this.input,
      rules: {},
    }

    for (let extractMethod of this.extractMethods) {
      inputRules = extractMethod(inputRules)
    }

    return inputRules
  }
}

export default FieldRulesExtracter
