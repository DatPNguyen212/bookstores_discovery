import { IS_SINGLE_VALIDATOR_BASE_INSTANCE } from '../abstracts/validation/SingleValidatorBase.js'
import { IS_GROUP_VALIDATOR_BASE_INSTANCE } from '../abstracts/validation/GroupValidatorBase.js'
import { IS_INPUT_RULES_INSTANCE } from './InputRules.js'
import typeCheck from '../utils/typeCheck.js'
import { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE } from '../abstracts/validation/InputErrorsFactoryBase.js'
import ValidationProcessorBase from '../abstracts/validation/ValidationProcessorBase.js'

class ValidationProcessor extends ValidationProcessorBase {
  constructor(singleValidator, groupValidator, inputErrorsFactory) {
    super()
    if (!singleValidator?.[IS_SINGLE_VALIDATOR_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of SingleValidatorBase to first parameter'
      )
    }

    if (!groupValidator?.[IS_GROUP_VALIDATOR_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of GroupValidatorBase in 2nd parameter'
      )
    }

    if (!inputErrorsFactory?.[IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE]) {
      throw new TypeError(
        'You need to pass instance of InputErrorsFactoryBase in 3rd parameter'
      )
    }

    this.singleValidator = singleValidator
    this.groupValidator = groupValidator
    this.inputErrorsFactory = inputErrorsFactory
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

    let inputErrorsArray = []

    for (let inputRules of inputRulesArray) {
      const input = inputRules.input
      const rules = Object.keys(inputRules.rules)

      const inputErrors = this.inputErrorsFactory.create(input)

      if (typeCheck.isSingleInputType(input)) {
        for (let rule of rules) {
          if (typeof this.singleValidator[rule] !== 'function') {
            throw new TypeError(
              `${rule} is not a supported single input validation rule`
            )
          } else {
            const errorMsg = this.singleValidator[rule](
              input,
              inputRules.rules[rule]
            )

            inputErrors.errors.push(errorMsg)
          }
        }
      }

      if (input.type === 'checkbox' || input.type === 'radio') {
        for (let rule of rules) {
          if (typeof this.groupValidator[rule] !== 'function') {
            throw new TypeError(
              `${rule} rule is not a supported group input validation rule`
            )
          } else {
            const errorMsg = this.groupValidator[rule](input)

            inputErrors.errors.push(errorMsg)
          }
        }
      }

      inputErrorsArray.push(inputErrors)
    }

    return inputErrorsArray
  }
}

export default ValidationProcessor
