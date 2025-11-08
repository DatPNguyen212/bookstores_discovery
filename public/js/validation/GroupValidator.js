import { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorFactoryBase.js'
import { IS_INPUT_RULES_INSTANCE } from './InputRules.js'
import objectUtils from '../utils/objectUtils.js'
class GroupValidator {
  constructor(inputErrorFactory) {
    if (!inputErrorFactory) {
      throw new TypeError(
        'You need to pass an instanceof InputErrorFactoryBase to first parameter'
      )
    }
    if (!inputErrorFactory[IS_INPUT_ERROR_FACTORY_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass an instanceof InputErrorFactoryBase to first parameter'
      )
    }
    this.inputErrorFactory = inputErrorFactory
  }

  required(inputRules) {
    if (inputRules[IS_INPUT_RULES_INSTANCE] !== true) {
      throw new TypeError(
        'You need to pass an instance of InputRules as an argument'
      )
    }

    if (
      inputRules.input.type !== 'checkbox' &&
      inputRules.input.type !== 'radio'
    ) {
      throw new TypeError(
        'inputRules.input needs to be a group element (either checkbox or radio)'
      )
    }

    const firstInput = inputRules.input

    const groupInputs = inputRules.getGroupInputs()

    const checkedGroupInputs = groupInputs.filter((groupInput) => {
      return groupInput.checked
    })

    const inputError = this.inputErrorFactory.create(firstInput)

    if (checkedGroupInputs.length > 0) {
      inputError.error = null
    } else {
      inputError.error = `Atleast 1 input needs to be checked`
    }

    return inputError
  }
}

export default GroupValidator
