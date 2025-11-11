import SingleValidatorBase from '../abstracts/validation/SingleValidatorBase.js'
import arrayUtils from '../utils/arrayUtils.js'
import InputErrorsFactory from './InputErrorsFactory.js'
import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorsFactoryBase.js'

class SingleValidator extends SingleValidatorBase {
  constructor() {
    super()
  }
  required(inputValue) {
    if (typeof inputValue !== 'string') {
      throw new TypeError(
        'You need to pass string data type to first parameter'
      )
    }

    let errorMsg

    if (inputValue.length === 0) {
      errorMsg = 'This field is required'
    }

    if (inputValue.length > 0) {
      errorMsg = null
    }

    return errorMsg
  }

  maxLength(inputValue, maxLength) {
    if (typeof inputValue !== 'string') {
      throw new TypeError(
        'You need to pass string data type to first parameter'
      )
    }

    if (typeof maxLength !== 'number' || maxLength <= 0) {
      throw new TypeError(
        'You need to pass number that is larger than 0 in 2nd paramer'
      )
    }

    const inputValueLength = inputValue.length
    let errorMsg

    if (inputValueLength <= maxLength) {
      errorMsg = null
    } else {
      errorMsg = `This field must have atleast ${maxLength} characters`
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
