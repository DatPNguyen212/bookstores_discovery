const IS_FORM_SUBMIT_CHECKER_BASE_INSTANCE = Symbol(
  'FormSubmitCheckerBase/is-instance'
)
class FormSubmitCheckerBase {
  constructor() {
    if (new.target === FormSubmitCheckerBase) {
      throw new Error('FormSubmitCheckerBase cannot be intantiated directly')
    }
    this[IS_FORM_SUBMIT_CHECKER_BASE_INSTANCE] = true
  }

  checkCanSubmit() {
    throw new Error('checkCanSubmit needs to be implemented in subclass')
  }
}

export default FormSubmitCheckerBase
export { IS_FORM_SUBMIT_CHECKER_BASE_INSTANCE }
