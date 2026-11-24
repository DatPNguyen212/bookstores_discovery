const IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE = Symbol(
  "InputErrorsFactoryBase/is-instance",
);
class InputErrorsFactoryBase {
  constructor() {
    if (new.target === InputErrorsFactoryBase) {
      throw new Error("You cannot directly instantiate InputErrorFactoryBase");
    }
    this[IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE] = true;
  }

  create() {
    throw new Error("create() needs to be implemented in subclass");
  }
}

export default InputErrorsFactoryBase;
export { IS_INPUT_ERRORS_FACTORY_BASE_INSTANCE };
