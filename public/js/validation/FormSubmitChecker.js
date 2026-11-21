import FormSubmitCheckerBase from '../../../public/js/abstracts/validation/FormSubmitCheckerBase.js'
import { IS_INPUT_ERRORS_INSTANCE } from './InputErrors.js'
class FormSubmitChecker extends FormSubmitCheckerBase {
  constructor() {
    super()
  }

  checkCanSubmit(inputErrorsArray) {
    if (!Array.isArray(inputErrorsArray)) {
      throw new TypeError('You need to pass an inputErrorsArray')
    } else {
      inputErrorsArray.forEach((item) => {
        if (!item?.[IS_INPUT_ERRORS_INSTANCE]) {
          throw new TypeError('You need to pass an inputErrorsArray')
        }
      })
    }

    let isNoErrors = true

    inputErrorsArray.forEach((inputErrors) => {
      if (inputErrors.checkAllNull() === false) {
        isNoErrors = false
      }
    })

    if (isNoErrors === false) {
      return false
    } else {
      return true
    }
  }
}

export default FormSubmitChecker
