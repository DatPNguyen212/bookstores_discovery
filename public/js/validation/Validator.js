import ValidatorBase from '../abstracts/validation/ValidatorBase.js'
import arrayUtils from '../utils/arrayUtils.js'

class Validator extends ValidatorBase {
  constructor() {
    super()
  }
  required(input) {
    if (
      !(
        input instanceof HTMLInputElement ||
        input instanceof HTMLTextAreaElement ||
        input instanceof HTMLSelectElement
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

  groupInputRequired(inputs) {
    if (!arrayUtils.areAllGroupInputs(inputs)) {
      throw new TypeError(
        'First parameter should be an array of group type inputs'
      )
    }
    for (let input of inputs) {
      if (input.checked === true) {
        return {
          inputs: inputs,
          error: null,
        }
      }
    }

    return {
      inputs: inputs,
      error: 'This field is required',
    }
  }
}

export default Validator
