import numberUtils from './numberUtils.js'
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
      if (option.uniqueItems !== true) {
        for (let i = 0; i < option.numberItems; i++) {
          const randItemFromEnum = this.getRandItem(option.enum)
          newArray.push(randItemFromEnum)
        }
      } else if (option.uniqueItems === true) {
        if (option.numberItems > option.enum.length) {
          throw new TypeError(
            "numberItems should be smaller than or equal to enum array's length"
          )
        }
        for (let i = 0; i < option.numberItems; i++) {
          let isInArray = true
          let randItem
          while (isInArray === true) {
            randItem = this.getRandItem(option.enum)
            isInArray = this.isValueInArray(randItem, newArray)
          }
          newArray.push(randItem)
          console.log(newArray)
        }
      }
    } else if (!option.enum && option.default) {
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
