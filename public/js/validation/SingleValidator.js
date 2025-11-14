import SingleValidatorBase from '../abstracts/validation/SingleValidatorBase.js'
import arrayUtils from '../utils/arrayUtils.js'
import InputErrorsFactory from './InputErrorsFactory.js'
import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorsFactoryBase.js'
import typeCheck from '../utils/typeCheck.js'

class SingleValidator extends SingleValidatorBase {
  constructor() {
    super()
  }
  required(input) {
    if (!typeCheck.isSingleInputType(input)) {
      throw new TypeError(
        'You need to pass single input type element to the function, NOT group input type element'
      )
    }

    const value = input.value
    let errorMsg

    if (value.length === 0) {
      errorMsg = 'This field is required'
    }

    if (value.length > 0) {
      errorMsg = null
    }

    return errorMsg
  }

  maxLength(input, maxLength) {
    if (!typeCheck.isSingleInputType(input)) {
      throw new TypeError(
        'First parameter needs to be a single input type element, NOT group input type element'
      )
    }

    if (typeof maxLength !== 'number' || maxLength <= 0) {
      throw new TypeError('Second parameter needs to be a positive number')
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

  minLength(input, minLength) {
    if (!typeCheck.isSingleInputType(input)) {
      throw new TypeError(
        'You need to pass a single input element to first parameter'
      )
    }

    if (typeof minLength !== 'number' || minLength <= 0) {
      throw new TypeError(
        'You need to pass a positive number to second parameter'
      )
    }

    const inputValue = input.value
    let errorMsg

    if (inputValue.length < minLength) {
      errorMsg = `The field requires a minimum of ${minLength} characters`
    } else {
      errorMsg = null
    }

    return errorMsg
  }
}

export default SingleValidator
