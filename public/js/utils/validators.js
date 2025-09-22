const validators = {
  isValidStoreName(name) {
    if (typeof name !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }
    if (name.length > 100) {
      return false
    } else if (name.length === 0) {
      return false
    } else {
      return true
    }
  },
  isValidAddress(address) {
    if (typeof address !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }
    if (address.length > 255) {
      return false
    } else if (address.length === 0) {
      return false
    } else {
      return true
    }
  },

  isValidDescription(description) {
    if (typeof description !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }
    if (description.length > 500) {
      return false
    } else if (description.length === 0) {
      return false
    } else {
      return true
    }
  },
}

export default validators
