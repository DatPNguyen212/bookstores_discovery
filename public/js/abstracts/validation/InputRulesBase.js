import typeCheck from '../../utils/typeCheck.js'

const IS_INPUT_RULES_BASE_INSTANCE = Symbol('InputRulesBase/is-instance')
class InputRulesBase {
  constructor(input) {
    if (new.target === InputRulesBase) {
      throw new Error('InputRulesBase cannot be directly instantiated')
    }

    if (!typeCheck.isInputElement(input)) {
      throw new TypeError(
        'You need to pass either an input element, select element or textarea element'
      )
    }

    this.input = input
    this.rules = {}
    this[IS_INPUT_RULES_BASE_INSTANCE] = true
  }

  addRule() {
    throw new Error('addRule() needs to be implemented in subclass')
  }
}

export default InputRulesBase
export { IS_INPUT_RULES_BASE_INSTANCE }
