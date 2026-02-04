const IS_VALIDATION_PROCESSOR_BASE_INSTANCE = Symbol(
  "ValidationProcessorBase/is-instance",
);
class ValidationProcessorBase {
  constructor() {
    if (new.target === ValidationProcessorBase) {
      throw new Error(
        "You cannot directly instantiate ValidationProcessorBase",
      );
    }
    this[IS_VALIDATION_PROCESSOR_BASE_INSTANCE] = true;
  }

  validate() {
    throw new Error("validate() needs to be implemented in subclass()");
  }
}

export default ValidationProcessorBase;
export { IS_VALIDATION_PROCESSOR_BASE_INSTANCE };
