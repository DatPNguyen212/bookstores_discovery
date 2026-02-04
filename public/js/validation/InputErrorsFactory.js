import InputErrors from "./InputErrors.js";
import typeCheck from "../utils/typeCheck.js";
import InputErrorsFactoryBase from "../abstracts/validation/InputErrorsFactoryBase.js";

class InputErrorsFactory extends InputErrorsFactoryBase {
  constructor() {
    super();
  }
  create(input) {
    if (!typeCheck.isInputElement(input)) {
      throw new TypeError(
        "You need to pass an input element in first parameter",
      );
    }
    return new InputErrors(input);
  }
}

export default InputErrorsFactory;
