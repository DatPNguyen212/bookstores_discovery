import typeCheck from '../utils/typeCheck.js'
const IS_INPUT_ERROR_INSTANCE = Symbol('InputError/is-instance')
class InputError {
  constructor(input) {
    if (!typeCheck.isInputElement(input)) {
      throw new TypeError(
        'You need to pass an input element to first parameter'
      )
    }
    this.input = input
    this.error = null
    this[IS_INPUT_ERROR_INSTANCE] = true
  }

  setError(error) {
    if (typeof error !== 'string') {
      throw new TypeError('You need to pass a string to first parameter')
    }
    this.error = error
  }
}

export default InputError
export { IS_INPUT_ERROR_INSTANCE }
