import RulesExtractBase from '../../abstracts/validation/RulesExtractBase.js'

class RulesExtractStrats extends RulesExtractBase {
  constructor() {
    super()
  }

  required(inputErrorObj) {
    const input = inputErrorObj.input

    if (input.required === true) {
      inputErrorObj.rules.required = true

      return inputErrorObj
    } else {
      return inputErrorObj
    }
  }

  maxLength(inputErrorObj) {
    const input = inputErrorObj.input

    if (
      input.maxLength !== -1 &&
      !Number.isNaN(input.maxLength) &&
      input.maxLength > 0
    ) {
      inputErrorObj.rules.maxLength = input.maxLength
      return inputErrorObj
    } else {
      return inputErrorObj
    }
  }
}

export default RulesExtractStrats
