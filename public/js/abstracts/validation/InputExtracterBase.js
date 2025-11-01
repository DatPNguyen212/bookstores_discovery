const IS_INPUT_EXTRACTER_BASE_INSTANCE = Symbol(
  'InputExtracterBase/is-instance'
)
class InputExtracterBase {
  constructor() {
    if (new.target === InputExtracterBase) {
      throw new Error('InputExtracterBase cannot be directly instantiated')
    }

    this[IS_INPUT_EXTRACTER_BASE_INSTANCE] = true
  }

  getFormInputs() {
    throw new Error('getFormInputs() needs to be implemented in subclass')
  }
}

export default InputExtracterBase
export { IS_INPUT_EXTRACTER_BASE_INSTANCE }
