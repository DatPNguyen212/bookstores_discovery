import typeCheck from '../utils/typeCheck.js'
const IS_INPUT_ERRORS_INSTANCE = Symbol('InputErrors/is-instance')
class InputErrors {
  constructor(input) {
    if (!typeCheck.isInputElement(input)) {
      throw new TypeError(
        'You need to pass an input element to first parameter'
      )
    }
    this.input = input
    this.errors = []
    this[IS_INPUT_ERRORS_INSTANCE] = true
  }

  addError(error) {
    if (typeof error !== 'string') {
      throw new TypeError('You need to pass a string to first parameter')
    }
    this.errors.push(error)
  }
}

export default InputErrors
export { IS_INPUT_ERRORS_INSTANCE }
