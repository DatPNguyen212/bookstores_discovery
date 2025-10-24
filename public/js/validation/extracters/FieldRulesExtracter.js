import typeCheck from '../../utils/typeCheck.js'

class FieldRulesExtracter {
  constructor(extractMethods) {
    if (Array.isArray(extractMethods)) {
      for (let method of extractMethods) {
        if (typeof method !== 'function') {
          throw new TypeError(
            'You need to pass an array of functions to first parameter'
          )
        }
      }
    } else {
      throw new TypeError(
        'You need to pass an array of functions to first parameter'
      )
    }
    this.extractMethods = extractMethods
  }

  extractSingleType(input) {
    if (!typeCheck.isSingleInputType(input)) {
      throw new TypeError(
        'You need to pass either input, textarea or select element'
      )
    }

    let inputErrorObj = {
      input: input,
      rules: {},
    }

    let modifiedInputError

    for (let extractMethod of this.extractMethods) {
      modifiedInputError = extractMethod(inputErrorObj)
    }

    return modifiedInputError
  }
}

export default FieldRulesExtracter
