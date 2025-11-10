import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorsFactoryBase.js'
import { IS_INPUT_RULES_INSTANCE } from './InputRules.js'
import objectUtils from '../utils/objectUtils.js'
import GroupValidatorBase from '../abstracts/validation/GroupValidatorBase.js'
class GroupValidator extends GroupValidatorBase {
  constructor() {
    super()
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

    let errorMsg

    if (checkedGroupInputs.length > 0) {
      errorMsg = null
    } else {
      errorMsg = `Atleast 1 input needs to be checked`
    }

    return errorMsg
  }
}

export default GroupValidator
