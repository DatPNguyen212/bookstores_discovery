import SingleValidatorBase from '../abstracts/validation/SingleValidatorBase.js'
import arrayUtils from '../utils/arrayUtils.js'
import InputErrorFactory from './InputErrorFactory.js'
import { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorFactoryBase.js'

class SingleValidator extends SingleValidatorBase {
  constructor(inputErrorFactory) {
    super()

    if (!inputErrorFactory) {
      throw new TypeError(
        'You need to pass an instance of InputErrorFactoryBase'
      )
    }

    if (!inputErrorFactory[IS_INPUT_ERROR_FACTORY_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass an instance of InputErrorFactoryBase'
      )
    }

    this.inputErrorFactory = inputErrorFactory
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
    const inputError = this.inputErrorFactory.create(input)

    if (!value) {
      inputError.error = 'This field is required'
      return inputError
    } else {
      inputError.error = null
      return inputError
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
    const inputError = this.inputErrorFactory.create(input)

    if (value.length > maxLength) {
      inputError.error = `This field needs to be less or equal to ${maxLength}`

      return inputError
    } else {
      inputError.error = null

      return inputError
    }
  }

  // groupInputRequired(inputs) {
  //   if (!arrayUtils.areAllGroupInputs(inputs)) {
  //     throw new TypeError(
  //       'First parameter should be an array of group type inputs'
  //     )
  //   }
  //   for (let input of inputs) {
  //     if (input.checked === true) {
  //       return {
  //         inputs: inputs,
  //         error: null,
  //       }
  //     }
  //   }

  //   return {
  //     inputs: inputs,
  //     error: 'This field is required',
  //   }
  // }
}

export default SingleValidator
