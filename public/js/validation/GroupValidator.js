import { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorFactoryBase.js'
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
  }
}

export default GroupValidator
