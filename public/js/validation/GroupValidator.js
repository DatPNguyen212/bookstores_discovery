import { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorFactoryBase.js'
import { IS_INPUT_RULES_INSTANCE } from './InputRules.js'
import objectUtils from '../utils/objectUtils.js'
import GroupValidatorBase from '../abstracts/validation/GroupValidatorBase.js'
class GroupValidator extends GroupValidatorBase {
  constructor(inputErrorFactory) {
    super()
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

  required(input) {
    if (!input) {
      throw new TypeError(
        'You need to pass group input element to first parameter'
      )
    }
    if (!(input.type === 'checkbox' || input.type === 'radio')) {
      throw new TypeError(
        'You need to pass group input element to first parameter'
      )
    }

    const form = input.form
    const name = input.name

    const groupInputs = Array.from(form.elements[name])

    const checkedGroupInputs = groupInputs.filter((groupInput) => {
      return groupInput.checked
    })

    const inputError = this.inputErrorFactory.create(input)

    if (checkedGroupInputs.length > 0) {
      inputError.error = null
    } else {
      inputError.error = `Atleast 1 input needs to be checked`
    }

    return inputError
  }
}

export default GroupValidator
