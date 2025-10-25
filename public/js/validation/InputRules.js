import typeCheck from '../utils/typeCheck.js'
import InputRulesBase from '../abstracts/validation/InputRulesBase.js'

class InputRules extends InputRulesBase {
  constructor(input) {
    super(input)
  }

  addRule(name, value) {
    if (typeof name !== 'string') {
      throw new TypeError('First param needs to be of string data type')
    }

    if (value === undefined || value === null || typeof value === 'object') {
      throw new TypeError(
        'You need to pass a value that is NOT undefined, null or object data type'
      )
    }
    this.rules[name] = value
  }
}

export default InputRules
