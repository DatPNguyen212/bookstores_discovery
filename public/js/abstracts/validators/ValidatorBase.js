class ValidatorBase {
  constructor() {
    if (new.target === ValidatorBase) {
      throw new Error('ValidatorBase cannot be instantiated directly')
    }
  }

  required() {
    throw new Error('required() needs to be implemented in subclass')
  }
  maxLength() {
    throw new Error('maxLength() needs to be implemented in subclass')
  }

  groupInputRequired() {
    throw new Error('groupInputRequired() needs to be implemented in subclass')
  }
}

export default ValidatorBase
