const IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE = Symbol(
  'ObjArgValidatorBase/is-instance'
)
class ObjArgValidatorBase {
  constructor() {
    if (new.target === ObjArgValidatorBase) {
      throw new Error('ObjArgValidatorBase cannot be directly instantiated')
    }
    this[IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE] = true
  }
}

export default ObjArgValidatorBase
export { IS_OBJ_ARG_VALIDATOR_BASE_INSTANCE }
