const seedHelpers = {
  generateRandNum(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError(
        'First and second parameters must be of number data type'
      )
    }

    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  generateRandName(firstNames, lastNames) {
    if (!Array.isArray(firstNames) || !Array.isArray(lastNames)) {
      throw new TypeError('First and second parameters must be an array')
    }

    firstNames.forEach((name) => {
      if (typeof name !== 'string') {
        throw new TypeError(
          'First parameter array must only contain string data type'
        )
      }
    })
    lastNames.forEach((name) => {
      if (typeof name !== 'string') {
        throw new TypeError(
          'Second parameter array must only contain string data type'
        )
      }
    })

    const randFirstName =
      firstNames[this.generateRandNum(0, firstNames.length - 1)]
    const randLastName =
      lastNames[this.generateRandNum(0, lastNames.length - 1)]
    const fullName = [randFirstName, randLastName].join(' ')
    return fullName
  },
}

export default seedHelpers
