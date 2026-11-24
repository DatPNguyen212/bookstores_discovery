const IS_INPUT_RULES_FACTORY_BASE_INSTANCE = Symbol(
  "InputRulesFactoryBase/is-instance",
);
class InputRulesFactoryBase {
  constructor() {
    if (new.target === InputRulesFactoryBase) {
      throw new Error("InputRulesFactoryBase cannot be instantiated directly");
    }
    this[IS_INPUT_RULES_FACTORY_BASE_INSTANCE] = true;
  }

  create() {
    throw new Error("create() needs to be implemented in subclass");
  }
}

export default InputRulesFactoryBase;
export { IS_INPUT_RULES_FACTORY_BASE_INSTANCE };
