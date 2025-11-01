import InputError from './InputError.js'
import typeCheck from '../utils/typeCheck.js'
import InputErrorFactoryBase from '../abstracts/validation/InputErrorFactoryBase.js'

class InputErrorFactory extends InputErrorFactoryBase {
  constructor() {
    super()
  }
  create(input) {
    if (!typeCheck.isInputElement(input)) {
      throw new TypeError(
        'You need to pass an input element in first parameter'
      )
    }
    return new InputError(input)
  }
}

export default InputErrorFactory
