import InputRules from './InputRules.js'
import typeCheck from '../utils/typeCheck.js'
import InputRulesFactoryBase from '../abstracts/validation/InputRulesFactoryBase.js'

class InputRulesFactory extends InputRulesFactoryBase {
  constructor() {
    super()
  }

  create(input) {
    if (!typeCheck.isInputElement(input)) {
      throw new TypeError(
        'You need to pass an input element to first parameter'
      )
    }
    return new InputRules(input)
  }
}

export default InputRulesFactory
