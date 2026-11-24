import ValidationSchema from "./ValidationSchema.js";
import objectUtils from "../utils/objectUtils.js";

class ValidationSchemaFactory {
  constructor() {}

  create(schemaDef) {
    if (!objectUtils.isPlainObject(schemaDef)) {
      throw new TypeError(
        "You need to pass a non empty plain object to first parameter",
      );
    }

    const keys = Object.keys(schemaDef);

    if (keys.length === 0) {
      throw new TypeError(
        "You need to pass a non empty plain object to first parameter",
      );
    }
    return new ValidationSchema(schemaDef);
  }
}

export default ValidationSchemaFactory;
