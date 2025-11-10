import SingleValidatorBase from '../abstracts/validation/SingleValidatorBase.js'
import arrayUtils from '../utils/arrayUtils.js'
import InputErrorsFactory from './InputErrorsFactory.js'
import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorsFactoryBase.js'

class SingleValidator extends SingleValidatorBase {
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
    let errorMsg

    if (!value) {
      errorMsg = 'This field is required'
    } else {
      errorMsg = null
    }

    return errorMsg
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
    let errorMsg

    if (value.length > maxLength) {
      errorMsg = `This field needs to be less or equal to ${maxLength}`

      return errorMsg
    } else {
      errorMsg = null
    }

    return errorMsg
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
