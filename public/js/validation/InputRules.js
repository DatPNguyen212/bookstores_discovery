import typeCheck from "../utils/typeCheck.js";

const IS_INPUT_RULES_INSTANCE = Symbol("InputRules/is-instance");

class InputRules {
  constructor(input) {
    if (!typeCheck.isInputElement(input)) {
      throw new TypeError(
        "You need to pass either an input element, select element or textarea element",
      );
    }
    this.input = input;
    this.rules = {};
    this[IS_INPUT_RULES_INSTANCE] = true;
  }

  addRule(name, value) {
    if (typeof name !== "string") {
      throw new TypeError("First param needs to be of string data type");
    }

    if (value === undefined || value === null || typeof value === "object") {
      throw new TypeError(
        "You need to pass a value that is NOT undefined, null or object data type",
      );
    }
    this.rules[name] = value;
  }

  getGroupInputs() {
    const form = this.input.form;
    const name = this.input.name;

    let inputs;
    if (name) {
      inputs = Array.from(form.elements[name]);
    } else {
      throw new TypeError(
        "The input in your inputRules instance needs to have name attribute value",
      );
    }

    const groupInputs = inputs.filter((input) => {
      return input.type === "checkbox" || input.type === "radio";
    });

    return groupInputs;
  }
}

export default InputRules;
export { IS_INPUT_RULES_INSTANCE };
