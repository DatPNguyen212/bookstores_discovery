import typeCheck from '../utils/typeCheck.js'

const IS_INPUT_RULES_INSTANCE = Symbol('InputRules/is-instance')

class InputRules {
  constructor(input) {
    if (!typeCheck.isInputElement(input)) {
      throw new TypeError(
        'You need to pass either an input element, select element or textarea element'
      )
    }
    this.input = input
    this.rules = {}
    this[IS_INPUT_RULES_INSTANCE] = true
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
export { IS_INPUT_RULES_INSTANCE }
