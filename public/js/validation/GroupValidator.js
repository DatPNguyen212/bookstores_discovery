import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorsFactoryBase.js'
import { IS_INPUT_RULES_INSTANCE } from './InputRules.js'
import objectUtils from '../utils/objectUtils.js'
import GroupValidatorBase from '../abstracts/validation/GroupValidatorBase.js'
class GroupValidator extends GroupValidatorBase {
  constructor() {
    super()
  }

  required(areInputsChecked) {
    if (!Array.isArray(areInputsChecked)) {
      throw new TypeError('You need to pass an array of boolean values')
    } else {
      for (let inputChecked of areInputsChecked) {
        if (typeof inputChecked !== 'boolean') {
          throw new TypeError('You need to pass an array of boolean values')
        }
      }
    }

    const inputsNotChecked = areInputsChecked.filter((item) => {
      return item === false
    })

    let errorMsg

    if (inputsNotChecked.length > 0) {
      errorMsg = 'Atleast one item must be checked'
    } else {
      errorMsg = null
    }

    return errorMsg
  }
}

export default GroupValidator
