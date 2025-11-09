const IS_GROUP_VALIDATOR_BASE_INSTANCE = Symbol(
  'GroupValidatorBase/is-instance'
)
class GroupValidatorBase {
  constructor() {
    if (new.target === GroupValidatorBase) {
      throw new Error('GroupValidatorBase cannot be instantiated directly')
    }
    this[IS_GROUP_VALIDATOR_BASE_INSTANCE] = true
  }

  required() {
    throw new Error('You need to implement required() in subclass')
  }
}

export default GroupValidatorBase
export { IS_GROUP_VALIDATOR_BASE_INSTANCE }
