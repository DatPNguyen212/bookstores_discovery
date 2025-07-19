import numberUtils from './numberUtils'
import lodash from 'lodash'
const arrayUtils = {
  getRandItem(array) {
    if (!Array.isArray(array)) {
      throw new TypeError('First parameter should be of array data type')
    }
    return array[numberUtils.generateRandNum(0, array.length - 1)]
  },
  generateArray(option) {
    let newArray = []

    if (!option.numberItems) {
      throw new TypeError(
        'First object parameter MUST have numberItems property'
      )
    } else if (option.enum && !option.default) {
      if (!Array.isArray(option.enum)) {
        throw new TypeError('enum property must be an array')
      }
      for (let i = 0; i < option.numberItems; i++) {
        const randItemFromEnum = this.getRandItem(option.enum)
        newArray.push(randItemFromEnum)
      }
    } else if (!option.enum && option.default) {
      if (typeof option.default !== 'number') {
        throw new TypeError('default property must be number data type')
      }
      for (let i = 0; i < option.numberItems; i++) {
        newArray.push(option.default)
      }
    } else if (!option.enum && !option.default) {
      throw new TypeError(
        'First object parameter must have enum property OR default property'
      )
    } else {
      throw new TypeError(
        'First object parameter CANNOT have both default property and enum property'
      )
    }

    return newArray
  },

  isValueInArray(value, array) {
    if (!Array.isArray(array)) {
      throw new TypeError('2nd param must be an array')
    }
    for (let item of array) {
      if (lodash.isEqual(value, item)) {
        return true
      }
    }
    return false
  },
}

export default arrayUtils
