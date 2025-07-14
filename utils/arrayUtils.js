import numberUtils from './numberUtils'
const arrayUtils = {
  getRandItem(array) {
    if (!Array.isArray(array)) {
      throw new TypeError('First parameter should be of array data type')
    }
    return array[numberUtils.generateRandNum(0, array.length - 1)]
  },
}

export default arrayUtils
