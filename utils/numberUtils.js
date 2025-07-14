const numberUtils = {
  generateRandNum(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError(
        'First and second parameters must be of number data type'
      )
    }

    return Math.floor(Math.random() * (max - min + 1)) + min
  },
}

export default numberUtils
