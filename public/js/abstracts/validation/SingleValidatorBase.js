const IS_SINGLE_VALIDATOR_BASE_INSTANCE = Symbol(
  'SingleValidatorBase/is-instance'
)
class SingleValidatorBase {
  constructor() {
    if (new.target === SingleValidatorBase) {
      throw new Error('ValidatorBase cannot be instantiated directly')
    }
    this[IS_SINGLE_VALIDATOR_BASE_INSTANCE] = true
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

export default SingleValidatorBase
export { IS_SINGLE_VALIDATOR_BASE_INSTANCE }
