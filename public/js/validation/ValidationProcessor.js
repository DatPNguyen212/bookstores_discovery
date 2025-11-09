import { IS_SINGLE_VALIDATOR_BASE_INSTANCE } from '../abstracts/validation/SingleValidatorBase.js'
import { IS_GROUP_VALIDATOR_BASE_INSTANCE } from '../abstracts/validation/GroupValidatorBase.js'
import { IS_INPUT_RULES_INSTANCE } from './InputRules.js'
import typeCheck from '../utils/typeCheck.js'

class ValidationProcessor {
  constructor(singleValidator, groupValidator) {
    if (
      !singleValidator ||
      !singleValidator[IS_SINGLE_VALIDATOR_BASE_INSTANCE]
    ) {
      throw new TypeError(
        'You need to pass instance of SingleValidatorBase to first parameter'
      )
    }

    if (!groupValidator || !groupValidator[IS_GROUP_VALIDATOR_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of GroupValidatorBase in 2nd parameter'
      )
    }

    this.singleValidator = singleValidator
    this.groupValidator = groupValidator
  }

  validate(inputRulesArray) {
    if (Array.isArray(inputRulesArray)) {
      for (let inputRules of inputRulesArray) {
        if (!(inputRules && inputRules[IS_INPUT_RULES_INSTANCE])) {
          throw new TypeError(
            'You need to pass an array of instances of InputRules in 2nd parameter'
          )
        }
      }
    } else {
      throw new TypeError(
        'You need to pass an array of instances of InputRules in 2nd parameter'
      )
    }

    let inputErrorArray = []

    for (let inputRules of inputRulesArray) {
      const input = inputRules.input
      const rules = Object.keys(inputRules.rules)

      if (typeCheck.isSingleInputType(input)) {
        for (let rule of rules) {
          const inputError = this.singleValidator[rule](
            input,
            inputRules.rules[rule]
          )

          inputErrorArray.push(inputError)
        }
      }

      if (input.type === 'checkbox' || input.type === 'radio') {
        for (let rule of rules) {
          const inputError = this.groupValidator[rule](input)

          inputErrorArray.push(inputError)
        }
      }
    }

    return inputErrorArray
  }
}

export default ValidationProcessor
