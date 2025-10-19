import ValidatorBase from '../abstracts/validators/ValidatorBase.js'

class Validator extends ValidatorBase {
  constructor() {
    super()
  }
  required(input) {
    if (input instanceof HTMLSelectElement) {
      throw new TypeError(
        'validator.required() does not support select input, only other single input type elements'
      )
    }
    if (
      !(
        input instanceof HTMLInputElement ||
        input instanceof HTMLTextAreaElement
      )
    ) {
      throw new TypeError(
        'You need to pass single input type element to the function, NOT group input type element'
      )
    }

    const value = input.value

    if (!value) {
      return {
        input: input,
        error: 'This field is required',
      }
    } else {
      return {
        input: input,
        error: null,
      }
    }
  }

  maxLength(input, maxLength) {
    if (
      !(
        input instanceof HTMLInputElement ||
        input instanceof HTMLTextAreaElement
      )
    ) {
      throw new TypeError(
        'First parameter needs to be a single input type element, NOT group input type element'
      )
    }

    if (typeof maxLength !== 'number') {
      throw new TypeError('Second parameter needs to be of number data type')
    }

    const value = input.value

    if (value.length > maxLength) {
      return {
        input: input,
        error: `This field needs to be less or equal to ${maxLength}`,
      }
    } else {
      return {
        input: input,
        error: null,
      }
    }
  }
}

export default Validator
