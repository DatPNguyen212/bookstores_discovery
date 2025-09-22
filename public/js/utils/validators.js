const validators = {
  isValidStoreName(name) {
    if (typeof name !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }
    if (name.length > 100) {
      return {
        result: false,
        errorMsg: 'Name must be less than or equal to 100 characters',
      }
    } else if (name.length === 0) {
      return {
        result: false,
        errorMsg: 'Name field must not be empty',
      }
    } else {
      return {
        result: true,
        errorMsg: null,
      }
    }
  },
  isValidAddress(address) {
    if (typeof address !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }
    if (address.length > 255) {
      return {
        result: false,
        errorMsg: 'Address field must not be more than 255 characters',
      }
    } else if (address.length === 0) {
      return {
        result: false,
        errorMsg: 'Address field must not be empty',
      }
    } else {
      return {
        result: true,
        errorMsg: null,
      }
    }
  },

  isValidDescription(description) {
    if (typeof description !== 'string') {
      throw new TypeError('First parameter should be of string data type')
    }
    if (description.length > 500) {
      return {
        result: false,
        errorMsg: 'Description must not be more than 500 characters',
      }
    } else if (description.length === 0) {
      return {
        result: false,
        errorMsg: 'Description must not be empty',
      }
    } else {
      return {
        result: true,
        errorMsg: null,
      }
    }
  },
}

export default validators
