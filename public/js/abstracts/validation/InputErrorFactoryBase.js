const IS_INPUT_ERROR_FACTORY_BASE_INSTANCE = Symbol(
  'InputErrorFactoryBase/is-instance'
)
class InputErrorFactoryBase {
  constructor() {
    if (new.target === InputErrorFactoryBase) {
      throw new Error('You cannot directly instantiate InputErrorFactoryBase')
    }
    this[IS_INPUT_ERROR_FACTORY_BASE_INSTANCE] = true
  }

  create() {
    throw new Error('create() needs to be implemented in subclass')
  }
}

export default InputErrorFactoryBase
export { IS_INPUT_ERROR_FACTORY_BASE_INSTANCE }
